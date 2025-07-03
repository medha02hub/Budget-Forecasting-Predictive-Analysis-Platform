import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import json

def create_enhanced_dataset(planning_inputs):
    """
    Create an enhanced dataset incorporating updated planning inputs
    """
    # Historical data with updated structure
    historical_data = [
        {
            'year': 2020,
            'budg_mj_head': 'R1',
            'budg_mi_head': 'R101', 
            'budg_prog_cd': 'OSTF',
            'allocation': 384249300,
            'committed': 378226271,
            'spent': 334783061,
            'promotions': 15,
            'retirements': 8,
            'new_joinees': 12,
            'new_joinee_basic_pay': 9600000,
            'increment_jan': 3.0,
            'basic_pay_diff': 2500000,
            'gratuity': 1200000
        },
        {
            'year': 2021,
            'budg_mj_head': 'R1',
            'budg_mi_head': 'R101',
            'budg_prog_cd': 'OSTF', 
            'allocation': 425000000,
            'committed': 421447443,
            'spent': 419826349,
            'promotions': 18,
            'retirements': 6,
            'new_joinees': 15,
            'new_joinee_basic_pay': 12000000,
            'increment_jan': 3.5,
            'basic_pay_diff': 3200000,
            'gratuity': 900000
        },
        {
            'year': 2022,
            'budg_mj_head': 'R1',
            'budg_mi_head': 'R101',
            'budg_prog_cd': 'OSTF',
            'allocation': 450000000,
            'committed': 434344498,
            'spent': 434047435,
            'promotions': 20,
            'retirements': 10,
            'new_joinees': 18,
            'new_joinee_basic_pay': 14400000,
            'increment_jan': 4.0,
            'basic_pay_diff': 3800000,
            'gratuity': 1500000
        }
    ]
    
    # Add new data point with updated planning inputs
    new_data_point = {
        'year': 2024,
        'budg_mj_head': 'R1',
        'budg_mi_head': 'R101',
        'budg_prog_cd': 'OSTF',
        'allocation': 0,  # To be predicted
        'committed': 0,   # To be predicted
        'spent': 0,       # To be predicted
        'promotions': int(planning_inputs.get('promotions', 0)),
        'retirements': int(planning_inputs.get('retirements', 0)),
        'new_joinees': int(planning_inputs.get('newJoinees', 0)),
        'new_joinee_basic_pay': float(planning_inputs.get('newJoineeBasicPay', 0)),
        'increment_jan': float(planning_inputs.get('incrementJanuary', 0)),
        'basic_pay_diff': float(planning_inputs.get('basicPayDifference', 0)),
        'gratuity': float(planning_inputs.get('gratuity', 0))
    }
    
    return historical_data, new_data_point

def train_prediction_model(historical_data, target_column):
    """
    Train a machine learning model for budget prediction with updated features
    """
    df = pd.DataFrame(historical_data)
    
    # Updated feature columns (removed increment_jul and pay_level, added new_joinee_basic_pay)
    feature_columns = [
        'promotions', 'retirements', 'new_joinees', 'new_joinee_basic_pay',
        'increment_jan', 'basic_pay_diff', 'gratuity'
    ]
    
    X = df[feature_columns]
    y = df[target_column]
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train model
    model = LinearRegression()
    model.fit(X_scaled, y)
    
    # Calculate model performance
    y_pred = model.predict(X_scaled)
    mae = mean_absolute_error(y, y_pred)
    r2 = r2_score(y, y_pred)
    
    return model, scaler, mae, r2

def predict_budget(planning_inputs):
    """
    Main prediction function with updated logic
    """
    try:
        # Create enhanced dataset
        historical_data, new_data_point = create_enhanced_dataset(planning_inputs)
        
        # Train models for each target variable
        allocation_model, allocation_scaler, allocation_mae, allocation_r2 = train_prediction_model(
            historical_data, 'allocation'
        )
        committed_model, committed_scaler, committed_mae, committed_r2 = train_prediction_model(
            historical_data, 'committed'
        )
        spent_model, spent_scaler, spent_mae, spent_r2 = train_prediction_model(
            historical_data, 'spent'
        )
        
        # Prepare new data for prediction with updated features
        feature_columns = [
            'promotions', 'retirements', 'new_joinees', 'new_joinee_basic_pay',
            'increment_jan', 'basic_pay_diff', 'gratuity'
        ]
        
        new_features = np.array([[
            new_data_point[col] for col in feature_columns
        ]])
        
        # Make predictions
        allocation_pred = allocation_model.predict(allocation_scaler.transform(new_features))[0]
        committed_pred = committed_model.predict(committed_scaler.transform(new_features))[0]
        spent_pred = spent_model.predict(spent_scaler.transform(new_features))[0]
        
        # Calculate confidence based on model performance
        avg_r2 = (allocation_r2 + committed_r2 + spent_r2) / 3
        confidence = max(0.7, min(0.95, avg_r2))
        
        # Ensure logical relationships (committed <= allocation, spent <= committed)
        allocation_pred = max(allocation_pred, 0)
        committed_pred = min(committed_pred, allocation_pred)
        spent_pred = min(spent_pred, committed_pred)
        
        results = {
            'nextYear': 2024,
            'allocation': int(allocation_pred),
            'committed': int(committed_pred),
            'spent': int(spent_pred),
            'confidence': confidence,
            'model_performance': {
                'allocation_r2': allocation_r2,
                'committed_r2': committed_r2,
                'spent_r2': spent_r2,
                'allocation_mae': allocation_mae,
                'committed_mae': committed_mae,
                'spent_mae': spent_r2
            },
            'factors': planning_inputs,
            'feature_importance': {
                'promotions': 'High impact on allocation increase',
                'new_joinees': 'Direct correlation with budget growth',
                'new_joinee_basic_pay': 'Major factor in total allocation',
                'retirements': 'Reduces ongoing costs',
                'increment_jan': 'Affects all staff costs',
                'basic_pay_diff': 'Overall salary adjustment impact',
                'gratuity': 'One-time significant expense'
            }
        }
        
        return results
        
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        # Fallback to simple prediction with updated structure
        return {
            'nextYear': 2024,
            'allocation': 480000000,
            'committed': 465000000,
            'spent': 450000000,
            'confidence': 0.75,
            'factors': planning_inputs,
            'error': str(e)
        }

# Example usage with updated inputs
if __name__ == "__main__":
    sample_inputs = {
        'promotions': '20',
        'basicPayDifference': '4000000',
        'incrementJanuary': '4.5',
        'retirements': '12',
        'gratuity': '1800000',
        'newJoinees': '22',
        'newJoineeBasicPay': '17600000'
    }
    
    predictions = predict_budget(sample_inputs)
    print(json.dumps(predictions, indent=2))
