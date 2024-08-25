const express = require("express");
const cors = require("cors");

const app = express();
const port = 3002;
app.use(cors({ origin: "*" }));
app.use(express.json());

const pgp = require("pg-promise")();
// const db = pgp('postgres://postgres:20250@localhost:5432/Automobile Garage');
const db = pgp(
  "postgres://user:pass@postgres/mydb"
);

const jobDataRouter = require("./jobdata.js")(db);
app.use(jobDataRouter);

const create_garages = require("./create_garages.js")(db);
app.use(create_garages);

const login = require("./login.js")(db);
app.use(login);

const Addimage = require("./Addimage.js")(db);
app.use(Addimage);

const AddAddWorkforceInformation = require("./AddWorkforceInformation.js")(db);
app.use(AddAddWorkforceInformation);

const customer = require("./customer.js")(db);
app.use(customer);

const car = require("./car.js")(db);
app.use(car);

const job = require("./job.js")(db);
app.use(job);

const job_picture = require("./job_picture.js")(db);
app.use(job_picture);

const bill = require("./bill.js")(db);
app.use(bill);

const car_receipt = require("./car_receipt.js")(db);
app.use(car_receipt);

const service = require("./service.js")(db);
app.use(service);

const account = require("./account.js")(db);
app.use(account);

const roles_permissions = require("./roles_permissions.js")(db);
app.use(roles_permissions);

const work_roles_permissions = require("./work_roles_permissions.js")(db);
app.use(work_roles_permissions);

const Weekly_Holidays = require("./Weekly_Holidays.js")(db);
app.use(Weekly_Holidays);

const Holidays = require("./Holidays.js")(db);
app.use(Holidays);

const part = require("./part.js")(db);
app.use(part);

const quotation_part = require("./quotation/quotation_part.js")(db);
app.use(quotation_part);

const quotation_service = require("./quotation/quotation_service.js")(db);
app.use(quotation_service);

const quotation = require("./quotation/quotation.js")(db);
app.use(quotation);

const Reservation = require("./Reservation.js")(db);
app.use(Reservation);

const bill_quotation = require("./bill_quotation.js")(db);
app.use(bill_quotation);

app.listen(port, () => {
  console.log(`Serveris running at http://localhost:${port}`);
});
