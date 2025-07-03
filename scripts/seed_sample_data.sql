-- Insert sample planning inputs for testing
INSERT INTO planning_inputs (
    year, promotions, basic_pay_difference, increment_january, 
    increment_july, retirements, gratuity, new_joinees, pay_level
) VALUES 
    (2020, 15, 2500000.00, 3.00, 2.50, 8, 1200000.00, 12, 7.50),
    (2021, 18, 3200000.00, 3.50, 3.00, 6, 900000.00, 15, 8.00),
    (2022, 20, 3800000.00, 4.00, 3.50, 10, 1500000.00, 18, 8.50)
ON CONFLICT DO NOTHING;

-- Insert sample predictions
INSERT INTO budget_predictions (
    prediction_year, predicted_allocation, predicted_committed, 
    predicted_spent, confidence_score, planning_input_id
) VALUES 
    (2023, 485000000, 470000000, 455000000, 0.8500, 1),
    (2024, 520000000, 505000000, 490000000, 0.8200, 2)
ON CONFLICT DO NOTHING;

-- Create function to calculate budget metrics
CREATE OR REPLACE FUNCTION calculate_budget_metrics(input_year INTEGER)
RETURNS TABLE(
    year INTEGER,
    total_allocation BIGINT,
    total_committed BIGINT,
    total_spent BIGINT,
    efficiency_ratio DECIMAL,
    growth_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        h.year,
        h.allocation,
        h.committed,
        h.spent,
        ROUND((h.spent::DECIMAL / h.allocation), 4) as efficiency_ratio,
        COALESCE(
            ROUND(((h.allocation - prev.allocation)::DECIMAL / prev.allocation * 100), 2),
            0
        ) as growth_rate
    FROM historical_budget_data h
    LEFT JOIN historical_budget_data prev ON prev.year = h.year - 1
    WHERE h.year = input_year OR input_year IS NULL
    ORDER BY h.year;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables
DROP TRIGGER IF EXISTS update_historical_budget_data_updated_at ON historical_budget_data;
CREATE TRIGGER update_historical_budget_data_updated_at
    BEFORE UPDATE ON historical_budget_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_planning_inputs_updated_at ON planning_inputs;
CREATE TRIGGER update_planning_inputs_updated_at
    BEFORE UPDATE ON planning_inputs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
