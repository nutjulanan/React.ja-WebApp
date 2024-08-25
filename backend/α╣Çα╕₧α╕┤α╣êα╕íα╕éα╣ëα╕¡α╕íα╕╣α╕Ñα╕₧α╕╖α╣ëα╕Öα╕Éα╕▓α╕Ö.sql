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

