CREATE TABLE patient (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exam (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patient (id) ON DELETE CASCADE,
    exam_date DATE NOT NULL,
    exam_type VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE image (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER NOT NULL REFERENCES exam (id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);