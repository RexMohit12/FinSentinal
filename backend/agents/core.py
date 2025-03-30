import torch
import xgboost as xgb
import numpy as np
import pandas as pd
import networkx as nx
import tensorflow as tf
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from typing import Dict, Any, List
import os
import h5py

class FraudDetectionAgent:
    def __init__(self):
        self.base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.models_path = os.path.join(self.base_path, 'models')
        
        # Load XGBoost model
        self.xgb_model = self._load_xgb_model()
        
        # Load Autoencoder model
        self.autoencoder = self._load_autoencoder()
        
        # Load GNN model
        self.gnn = self._load_gnn()
        
        # Load FinBERT model
        self.finbert, self.finbert_tokenizer = self._load_finbert()
        
        # Load Behavioral LSTM model
        self.behavioral_model = self._load_behavioral_model()

    def _load_xgb_model(self):
        """Load XGBoost model"""
        model_path = os.path.join(self.models_path, 'xgb_fraud_model_final.json')
        model = xgb.Booster()
        model.load_model(model_path)
        return model

    def _load_autoencoder(self):
        """Load Autoencoder model"""
        model_path = os.path.join(self.models_path, 'fraud_autoencoder_final.h5')
        try:
            # Try to load with TensorFlow
            return tf.keras.models.load_model(model_path)
        except Exception as e:
            print(f"Error loading autoencoder with TensorFlow: {e}")
            # Fallback to h5py for loading
            return h5py.File(model_path, 'r')

    def _load_gnn(self):
        """Load GNN model if available, otherwise return None"""
        model_path = os.path.join(self.models_path, 'gnn_model.pth')
        try:
            # Attempt to load the model if it exists
            if os.path.exists(model_path):
                return torch.load(model_path, map_location=torch.device('cpu'))
            else:
                print("GNN model file not found, network analysis will use NetworkX algorithms instead")
                return None
        except Exception as e:
            print(f"Error loading GNN model: {e}")
            return None

    def _load_finbert(self):
        """Load FinBERT model"""
        model_dir = os.path.join(self.models_path, 'finBert_model')
        try:
            tokenizer = AutoTokenizer.from_pretrained(model_dir)
            model = AutoModelForSequenceClassification.from_pretrained(model_dir)
            return model, tokenizer
        except Exception as e:
            print(f"Error loading FinBERT model: {e}")
            return None, None

    def _load_behavioral_model(self):
        """Load Behavioral LSTM model"""
        model_path = os.path.join(self.models_path, 'behavioral_lstm.pth')
        try:
            return torch.load(model_path, map_location=torch.device('cpu'))
        except Exception as e:
            print(f"Error loading behavioral model: {e}")
            return None

    def predict(self, inputs: Dict[str, Any]):
        """Main prediction method that integrates all models"""
        results = {}
        
        # Behavioral Analysis using LSTM
        if 'transaction_sequence' in inputs and self.behavioral_model is not None:
            results['behavior'] = self._analyze_behavior(inputs['transaction_sequence'])
            
        # Transaction Fraud Check using XGBoost and Autoencoder
        if 'transaction_data' in inputs and self.xgb_model is not None:
            results['fraud'] = self._check_fraud(inputs['transaction_data'])
            
        # Compliance Check using FinBERT
        if 'transaction_text' in inputs and self.finbert is not None and self.finbert_tokenizer is not None:
            results['compliance'] = self._check_compliance(inputs['transaction_text'])
            
        # Network Analysis using GNN if available
        if 'network_data' in inputs and self.gnn is not None:
            results['network'] = self._analyze_network(inputs['network_data'])
            
        return results

    def _analyze_behavior(self, sequence: List[List[float]]):
        """Analyze transaction sequence using behavioral LSTM model"""
        try:
            # Convert sequence to tensor
            tensor_seq = torch.tensor(sequence, dtype=torch.float32).unsqueeze(0)
            
            # Set model to evaluation mode
            self.behavioral_model.eval()
            
            # Get prediction
            with torch.no_grad():
                output = self.behavioral_model(tensor_seq)
                
            # Return anomaly score
            return output.item()
        except Exception as e:
            print(f"Error in behavior analysis: {e}")
            return 0.0

    def _check_fraud(self, transaction: Dict[str, Any]):
        """Check transaction for fraud using XGBoost model"""
        try:
            # Convert transaction to DataFrame
            df = pd.DataFrame([transaction])
            
            # Create DMatrix
            dmatrix = xgb.DMatrix(df)
            
            # Get prediction
            xgb_pred = self.xgb_model.predict(dmatrix)[0]
            
            # If autoencoder is available, combine predictions
            if hasattr(self.autoencoder, 'predict'):
                # Normalize data for autoencoder
                ae_input = np.array([list(transaction.values())], dtype=np.float32)
                
                # Get reconstruction error
                ae_pred = self.autoencoder.predict(ae_input)
                reconstruction_error = np.mean(np.square(ae_input - ae_pred))
                
                # Combine predictions (simple average)
                return (xgb_pred + min(reconstruction_error, 1.0)) / 2
            
            return xgb_pred
        except Exception as e:
            print(f"Error in fraud check: {e}")
            return 0.0

    def _check_compliance(self, text: str):
        """Check transaction text for compliance issues using FinBERT"""
        try:
            # Tokenize text
            inputs = self.finbert_tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
            
            # Get prediction
            with torch.no_grad():
                outputs = self.finbert(**inputs)
                probs = torch.softmax(outputs.logits, dim=-1)
                
            # Return probabilities
            return probs[0].tolist()
        except Exception as e:
            print(f"Error in compliance check: {e}")
            return [0.5, 0.5]  # Default to neutral

    def _analyze_network(self, network_data: Dict[str, Any]):
        """Analyze transaction network using NetworkX algorithms"""
        try:
            # Create a graph from network data
            G = nx.DiGraph()
            
            # Add nodes (entities)
            if 'nodes' in network_data:
                for node_id, node_attrs in network_data['nodes'].items():
                    G.add_node(node_id, **node_attrs)
            
            # Add edges (transactions)
            if 'edges' in network_data:
                for edge in network_data['edges']:
                    G.add_edge(
                        edge['source'], 
                        edge['target'], 
                        amount=edge.get('amount', 0),
                        timestamp=edge.get('timestamp', 0),
                        **{k: v for k, v in edge.items() if k not in ['source', 'target', 'amount', 'timestamp']}
                    )
            
            # Calculate various centrality measures
            risk_scores = {}
            
            # 1. Degree centrality - identifies nodes with many connections
            degree_centrality = nx.degree_centrality(G)
            
            # 2. Betweenness centrality - identifies nodes that act as bridges
            betweenness_centrality = nx.betweenness_centrality(G)
            
            # 3. PageRank - identifies influential nodes
            pagerank = nx.pagerank(G)
            
            # 4. Community detection using Louvain method (if available) or connected components
            try:
                from community import best_partition
                communities = best_partition(G.to_undirected())
            except ImportError:
                # Fallback to connected components
                communities = {}
                for i, component in enumerate(nx.weakly_connected_components(G)):
                    for node in component:
                        communities[node] = i
            
            # Calculate risk score for each node based on centrality measures
            for node in G.nodes():
                # Combine centrality measures (higher centrality = higher risk)
                node_risk = (
                    degree_centrality.get(node, 0) * 0.3 +
                    betweenness_centrality.get(node, 0) * 0.4 +
                    pagerank.get(node, 0) * 0.3
                )
                
                # Adjust risk based on node attributes
                node_attrs = G.nodes[node]
                if node_attrs.get('risk_score'):
                    node_risk = (node_risk + node_attrs.get('risk_score')) / 2
                
                risk_scores[node] = node_risk
            
            # Calculate overall network risk score
            if risk_scores:
                overall_risk = sum(risk_scores.values()) / len(risk_scores)
                
                # Look for suspicious patterns
                # 1. Cyclic transactions
                cycles = list(nx.simple_cycles(G))
                if cycles:
                    cycle_penalty = min(0.2, 0.05 * len(cycles))
                    overall_risk += cycle_penalty
                
                # 2. Unusual transaction amounts
                amounts = [edge[2].get('amount', 0) for edge in G.edges(data=True)]
                if amounts:
                    mean_amount = sum(amounts) / len(amounts)
                    outliers = sum(1 for amount in amounts if amount > 3 * mean_amount)
                    if outliers:
                        outlier_penalty = min(0.15, 0.03 * outliers)
                        overall_risk += outlier_penalty
                
                # Ensure risk score is between 0 and 1
                overall_risk = max(0.0, min(1.0, overall_risk))
                
                return overall_risk
            else:
                return 0.5  # Default risk score if no nodes
        except Exception as e:
            print(f"Error in network analysis: {e}")
            return 0.5  # Default risk score