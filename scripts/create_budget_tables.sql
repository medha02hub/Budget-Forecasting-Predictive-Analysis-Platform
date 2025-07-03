-- Create database schema for budget prediction system
CREATE TABLE IF NOT EXISTS historical_budget_data (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    budg_mj_head VARCHAR(10) NOT NULL,
    budg_mi_head VARCHAR(10) NOT NULL,
    budg_prog_cd VARCHAR(10) NOT NULL,
    allocation BIGINT NOT NULL,
    committed BIGINT NOT NULL,
    spent BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for planning inputs
CREATE TABLE IF NOT EXISTS planning_inputs (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    promotions INTEGER DEFAULT 0,
    basic_pay_difference DECIMAL(15,2) DEFAULT 0,
    increment_january DECIMAL(5,2) DEFAULT 0,
    increment_july DECIMAL(5,2) DEFAULT 0,
    retirements INTEGER DEFAULT 0,
    gratuity DECIMAL(15,2) DEFAULT 0,
    new_joinees INTEGER DEFAULT 0,
    pay_level DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for predictions
CREATE TABLE IF NOT EXISTS budget_predictions (
    id SERIAL PRIMARY KEY,
    prediction_year INTEGER NOT NULL,
    predicted_allocation BIGINT NOT NULL,
    predicted_committed BIGINT NOT NULL,
    predicted_spent BIGINT NOT NULL,
    confidence_score DECIMAL(5,4) NOT NULL,
    planning_input_id INTEGER REFERENCES planning_inputs(id),
    model_version VARCHAR(50) DEFAULT 'v1.0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_historical_budget_year ON historical_budget_data(year);
CREATE INDEX IF NOT EXISTS idx_planning_inputs_year ON planning_inputs(year);
CREATE INDEX IF NOT EXISTS idx_predictions_year ON budget_predictions(prediction_year);

-- Insert historical data
INSERT INTO historical_budget_data (year, budg_mj_head, budg_mi_head, budg_prog_cd, allocation, committed, spent)
VALUES 
    (2020, 'R1', 'R101', 'OSTF', 384249300, 378226271, 334783061),
    (2021, 'R1', 'R101', 'OSTF', 425000000, 421447443, 419826349),
    (2022, 'R1', 'R101', 'OSTF', 450000000, 434344498, 434047435)
ON CONFLICT DO NOTHING;

-- Create view for analysis
CREATE OR REPLACE VIEW budget_analysis AS
SELECT 
    year,
    allocation,
    committed,
    spent,
    ROUND((committed::DECIMAL / allocation * 100), 2) as commitment_rate,
    ROUND((spent::DECIMAL / allocation * 100), 2) as utilization_rate,
    LAG(allocation) OVER (ORDER BY year) as prev_allocation,
    ROUND(((allocation - LAG(allocation) OVER (ORDER BY year))::DECIMAL / 
           LAG(allocation) OVER (ORDER BY year) * 100), 2) as growth_rate
FROM historical_budget_data
ORDER BY year;
