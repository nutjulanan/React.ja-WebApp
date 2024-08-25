CREATE TABLE WorkforceInformation (
  id SERIAL PRIMARY KEY, 
  national_id VARCHAR(20),
  namePrefix VARCHAR(20),
  full_name VARCHAR(100),
  age INTEGER,
  sex VARCHAR(10),
  email VARCHAR(100),
  telephone_number VARCHAR(20),
  secondaryContact VARCHAR(100),
  address VARCHAR(200),
  jobExperience VARCHAR(100),
  salary INTEGER,
  totalVacationDays INTEGER,
  start_work_date DATE,
  end_of_work_day DATE,
  update_record TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW; 
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_workforceinformation_modtime
BEFORE UPDATE ON WorkforceInformation
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();


--/////////////////////////////////////////////////////////////////////////////////////////////////////////


CREATE TABLE Account (
  user_id SERIAL PRIMARY KEY,
  Data_id INTEGER,
  username VARCHAR(50)UNIQUE,
  password_hash VARCHAR(255),
  last_login TIMESTAMP,
  login_attempts INTEGER,
  update_record TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Data_id) REFERENCES WorkforceInformation(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;  
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_account_modtime
BEFORE UPDATE ON Account
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

--/////////////////////////////////////////////////////////////////////////////////////////////////////////

CREATE TABLE WeeklySchedule (
    id SERIAL PRIMARY KEY,
    Monday BOOLEAN,
    Tuesday BOOLEAN,
    Wednesday BOOLEAN,
    Thursday BOOLEAN,
    Friday BOOLEAN,
    Saturday BOOLEAN,
    Sunday BOOLEAN,
    publicHolidays INTEGER,
	update_record TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW; 
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_weekly_schedule_modtime
BEFORE UPDATE ON WeeklySchedule
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();


--/////////////////////////////////////////////////////////////////////////////////////////////////////////

CREATE TABLE Garages (
    garage_id SERIAL PRIMARY KEY,
    garage_name VARCHAR(100),
    garageOwner_id INTEGER REFERENCES WorkforceInformation(id),
	TIN VARCHAR(100),
    telephone_number VARCHAR(20),
    address VARCHAR(200),
    email VARCHAR(100),
	line_id VARCHAR(100),
	workingHours VARCHAR(100),
	logo_img BYTEA,
    detail_garages TEXT,
    update_record TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW; 
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_garages_modtime
BEFORE UPDATE ON Garages
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

--/////////////////////////////////////////////////////////////////////////////////////////////////////////

CREATE TABLE roles_permissions (
    id SERIAL PRIMARY KEY,
	name_role VARCHAR(200),
    inventoryStock BOOLEAN,
    job BOOLEAN,
    CarAndCustomer BOOLEAN,
    Quotations BOOLEAN,
    Requisitions BOOLEAN,
    VehicleReceipts BOOLEAN,
    RepairAppointments BOOLEAN,
    Garages BOOLEAN,
	update_record TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_roles_permissions_updated_at
BEFORE UPDATE ON roles_permissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE Work_roles_permissions (
    role_id INTEGER REFERENCES roles_permissions(id),
    Workforce_id INTEGER REFERENCES WorkforceInformation(id) ON DELETE CASCADE,
    update_record TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (role_id, Workforce_id)
);

CREATE TRIGGER update_Work_roles_permissions_updated_at
BEFORE UPDATE ON Work_roles_permissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

--/////////////////////////////////////////////////////////////////////////////////////////////////////////

CREATE TABLE ServiceRepairInfo (
  id SERIAL PRIMARY KEY,
  name VARCHAR(225),
  Info TEXT,
  img_service BYTEA,
  update_record TEXT,
  last_modified TIMESTAMP DEFAULT current_timestamp
);
--/////////////////////////////////////////////////////////////////////////////////////////////////////////

CREATE TABLE customer (
    id SERIAL PRIMARY KEY,
	national_id VARCHAR(20),
	namePrefix VARCHAR(20),
    full_name VARCHAR,
    sex VARCHAR,
    birth_date DATE,
    tele_number VARCHAR,
    E_mail VARCHAR,
    address VARCHAR,
    detail VARCHAR,
    update_record TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW; 
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_job_modtime
BEFORE UPDATE ON customer
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

--/////////////////////////////////////////////////////////////////////////////////////////////////////////

CREATE TABLE car (
    registration_id VARCHAR  PRIMARY KEY,
    owner_id INTEGER REFERENCES customer(id),
    Policy_number VARCHAR,
    insurance_company VARCHAR,
    insurance_expiry_date DATE,
    car_type VARCHAR,
    brand VARCHAR,
    model VARCHAR,
    year INTEGER,
    color VARCHAR,
    engine_number VARCHAR,
    chassis_number VARCHAR,
    Gear_type VARCHAR,
    detail VARCHAR,
    update_record TEXT, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW; 
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_car_modtime
BEFORE UPDATE ON car
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

--/////////////////////////////////////////////////////////////////////////////////////////////////////////

CREATE TABLE job (
    id SERIAL PRIMARY KEY,
    responsible_Employee_id INTEGER REFERENCES WorkforceInformation(id),
    car_id VARCHAR REFERENCES car(registration_id),
    car_in DATE,
    car_out DATE,
    car_finished DATE,
    job_status VARCHAR,
    repair_details TEXT,
    customer_feedback TEXT,
    update_record TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;  
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_modtime
BEFORE UPDATE ON job
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

--/////////////////////////////////////////////////////////////////////////////////////////////////////////

CREATE TABLE job_picture (
  id SERIAL PRIMARY KEY,
  responsible_employee_id INTEGER REFERENCES WorkforceInformation(id),
  job_id INTEGER REFERENCES job(id),
  picture BYTEA,
  details TEXT,
  job_status VARCHAR,
  update_record TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_picture_modtime
BEFORE UPDATE ON job_picture
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

--/////////////////////////////////////////////////////////////////////////////////////////////////////////
CREATE TABLE bill (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES job(id),
    customer_id INTEGER REFERENCES customer(id),
    item_details TEXT,
    tax_amount INTEGER,
    discount_amount INTEGER,
    total_amount INTEGER,
    payment_method VARCHAR,
    payment_status VARCHAR,
	bill_date DATE,
	picture BYTEA,
    update_record TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW; 
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_bill_modtime
BEFORE UPDATE ON bill
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
--/////////////////////////////////////////////////////////////////////////////////////////////////////////


CREATE TABLE car_receipt (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customer(id),
    job_id INTEGER REFERENCES job(id),
    estimated_cost INTEGER,
    receipt_status VARCHAR,
    reception_date DATE,
	picture BYTEA,
    update_record TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW; 
END;
$$ LANGUAGE 'plpgsql';
CREATE TRIGGER update_car_receipt_modtime
BEFORE UPDATE ON car_receipt
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
--/////////////////////////////////////////////////////////////////////////////////////////////////////////

CREATE TABLE quotation (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES job(id),
    customer_id INTEGER REFERENCES customer(id),
    quotation_date DATE,
	quotation_end_date DATE,
    total_amount INTEGER,
    details TEXT,
	picture BYTEA,
    update_record TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW; 
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_quotation_modtime
BEFORE UPDATE ON quotation
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

--/////////////////////////////////////////////////////////////////////////////////////////////////////////

CREATE TABLE service (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR,
    unit_price INTEGER,
    description TEXT,
    update_record TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW; 
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_service_modtime
BEFORE UPDATE ON service
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

--/////////////////////////////////////////////////////////////////////////////////////////////////////////

CREATE TABLE tool (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    price INTEGER,
    quantity INTEGER,
    type VARCHAR,
    description TEXT,
    update_record TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW; 
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_tool_modtime
BEFORE UPDATE ON tool
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

--//////////////////////

CREATE TABLE part (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    price INTEGER,
    quantity INTEGER,
    type VARCHAR,
    description TEXT,
    update_record TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW; 
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_part_modtime
BEFORE UPDATE ON part
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
--/////////////////////////////////////////////////////////////////////////////////////////////////////////

CREATE TABLE Reservation (
    id SERIAL PRIMARY KEY,
    --customer_id INTEGER REFERENCES customer(id),
	fullname VARCHAR,
	E_mail VARCHAR,
	tele_number VARCHAR,
    Date DATE,
	WorkdayStatus BOOLEAN,
	status VARCHAR,
    response_details TEXT,
    reservation_type VARCHAR,
    details TEXT,
    --assigned_employee_id INTEGER REFERENCES WorkforceInformation(id),
    update_record TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW; 
END;
$$ LANGUAGE 'plpgsql';
CREATE TRIGGER update_reservation_modtime
BEFORE UPDATE ON Reservation
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

--/////////////////////////////////////////////////////////////////////////////////////////////////////////


CREATE TABLE Holidays (
    id SERIAL PRIMARY KEY,
    Date DATE,
    NameHolidays VARCHAR,
    WorkdayStatus BOOLEAN,
	update_record TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW; 
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_holidays_modtime
BEFORE UPDATE ON Holidays
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

--/////////////////////////////////////////////////////////////////////////////////////////////////////////
CREATE TABLE quotation_part (
    quotation_id INTEGER REFERENCES quotation(id) ON DELETE CASCADE,
    part_id INTEGER REFERENCES part(id) ON DELETE CASCADE,
    quantity INTEGER,
    line_total INTEGER,
    update_record TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (quotation_id, part_id)
);
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW; 
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_quotation_part_modtime
BEFORE UPDATE ON quotation_part
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
--/////////////////////////////////////////////////////////////////////////////////////////////////////////


CREATE TABLE quotation_service (
    quotation_id INTEGER REFERENCES quotation(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES service(id) ON DELETE CASCADE,
    quantity INTEGER,
    line_total INTEGER,
    update_record TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (quotation_id, service_id)
);
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW; 
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_quotation_service_modtime
BEFORE UPDATE ON quotation_service
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

--/////////////////////////////////////////////////////////////////////////////////////////////////////////

CREATE TABLE bill_quotation (
    bill_id INTEGER REFERENCES bill(id) ON DELETE CASCADE,
    quotation_id INTEGER REFERENCES quotation(id) ON DELETE CASCADE,
    PRIMARY KEY (bill_id, quotation_id)
);

INSERT INTO WorkforceInformation (
  national_id, namePrefix, full_name, age, sex, 
  email, telephone_number, secondaryContact, address, 
  jobExperience, salary, totalVacationDays, start_work_date, 
  end_of_work_day, update_record
) VALUES (
  '1200901286946', 'นาย', 'ตะวัน มณีรัตน์', 23, 'ชาย', 
  '64015048@kmitl.ac.th', '0927577762', '0820027xxx', '129/8 moo 8', 
  'Software Developer 5 ปี', 70000, 0, '2023-01-01', 
  NULL, NULL
);

INSERT INTO Account (
   data_id, username, password_hash, last_login, login_attempts, update_record
) VALUES (
   1,'admin', 'admin', NULL, NULL, NULL
);

INSERT INTO roles_permissions (
   name_role, inventorystock, job, carandcustomer, quotations, requisitions, vehiclereceipts, repairappointments, garages, update_record
) VALUES (
   'Manager', TRUE, TRUE, TRUE , TRUE, TRUE, TRUE, TRUE, TRUE,1
);

INSERT INTO work_roles_permissions (
  role_id, workforce_id, update_record
) VALUES (
  1, 1, 1
);

INSERT INTO Garages (
    garage_name, 
    garageOwner_id, 
    TIN, 
    telephone_number, 
    address, 
    email, 
    line_id, 
    workingHours, 
    logo_img, 
    detail_garages, 
    update_record
) VALUES (
    'Garage Example Name', -- garage_name
    1, -- garageOwner_id: สมมติว่า ID นี้มีอยู่จริงในตาราง WorkforceInformation
    '1234567890', -- TIN
    '080-123-4567', -- telephone_number
    '123 Example St, Example City, Example Country', -- address
    'example@garage.com', -- email
    'examplelineid', -- line_id
    '9AM-5PM', -- workingHours
    NULL, -- logo_img: ใส่เป็น NULL หรือข้อมูลไบนารีของรูปภาพ
		'Detailed description of the garage.', -- detail_garages
    'Initial creation of record' -- update_record
);

INSERT INTO WeeklySchedule (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, publicHolidays, update_record)
VALUES (TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, 0, 'Initial creation');
