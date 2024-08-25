export default function Bill_request() {
    return (
        <>
            <br></br>
            <h1 className="text-3xl">ค้ณหาใบเบิก</h1><br></br>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">ค้ณหาใบเบิก</span>
                    </div>
                    <input type="text" placeholder="" className="input input-bordered w-full max-w-xs px-8 py-2" />
                    <br></br>
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn px-8 py-2 m-2">ค้ณหาใบเบิก</div>
                        <div tabIndex={0} className="dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-primary text-primary-content">
                            <div className="card-body">
                                <h3 className="card-title">ไม่พบ</h3>
                                <p>ไม่ได้เชื่อมต่อระบบ MongoDB</p>
                            </div>
                        </div>
                    </div>
                    <h2 className="bill_table m-5">แสดงตารางข้อมูลใบเบิก</h2>
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>ชื่อ</th>
                                    <th>รายละเอียด</th>
                                    <th>เลือก</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* row 1 */}
                                <tr>
                                    <th>1</th>
                                    <td>ช่างสมชาย</td>
                                    <td>xxxxxxxx</td>
                                    <label className="label">
                                        <input type="checkbox"
                                            name="Monday"
                                            className="checkbox checkbox-bordered" />
                                    </label>
                                </tr>
                                {/* row 2 */}
                                <tr>
                                    <th>2</th>
                                    <td>ช่างสาย </td>
                                    <td>xxxxxxxx</td>
                                    <label className="label">
                                        <input type="checkbox"
                                            name="Monday"
                                            className="checkbox checkbox-bordered" />
                                    </label>
                                </tr>
                                {/* row 3 */}
                                <tr>
                                    <th>3</th>
                                    <td>ช่างจุ้มเม่ง</td>
                                    <td>xxxxxxxx</td>
                                    <label className="label">
                                        <input type="checkbox"
                                            name="Monday"
                                            className="checkbox checkbox-bordered" />
                                    </label>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-center space-x-2">
                        <button className="btn btn-active btn-primary px-5 py-2 ">แก้ไข</button>
                        <button className="btn btn-error px-5 py-2 ">ลบ</button>
                        <button className="btn btn-active btn-accent px-5 py-2">พิมพ์</button>
                    </div>

                    <h3 className="text-3xl m-10">สร้างใบเบิก</h3><br></br>

                    <div className="label">
                        <span className="label-text">รายการสินค้า</span>
                    </div>
                    <select className="select select-bordered w-full max-w-xs">
                        <option disabled selected>เลือก</option>
                        <option>1</option>
                        <option>2</option>
                        <option>none</option>
                    </select>

                    <div className="label">
                        <span className="label-text">ยี่ห้อ</span>
                    </div>
                    <select className="select select-bordered w-full max-w-xs">
                        <option disabled selected>เลือก</option>
                        <option>1</option>
                        <option>2</option>
                        <option>none</option>
                    </select>
                    <div className="label">

                        <span className="label-text">ประเภท</span>
                    </div>
                    <select className="select select-bordered w-full max-w-xs">
                        <option disabled selected>เลือก</option>
                        <option>1</option>
                        <option>2</option>
                        <option>none</option>
                    </select>
                    <div className="label">
                        <span className="label-text">จำนวน</span>
                    </div>
                    <select className="select select-bordered w-full max-w-xs">
                        <option disabled selected>เลือก</option>
                        <option>1</option>
                        <option>2</option>
                        <option>none</option>
                    </select>
                    <p className="clash m-3">ราคารวม xxx </p>
                    <button className="btn btn-active btn-primary px-2 py-2 ">บันทึก</button>
                    <div className="label"></div>
                    <button className="btn btn-active btn-accent px-2 py-2">พิมพ์</button>

                </label>
            </div>

        </>
    );
}
