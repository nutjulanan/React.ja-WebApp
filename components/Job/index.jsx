
export default function Job() {
  return (
      <>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>ชื่อ</th>
              <th>รุ่นรถ</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>1</th>
              <td>ตะวัน</td>
              <td>Honda color : Red </td>

              <td>กำลังดำเนินการ</td>
              <td style={{ display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" defaultChecked="checked" className="checkbox checkbox-sm" />
            </td> 
            </tr>
            {/* row 2 */}
            <tr>
              <th>2</th>
              <td>พงศ์เทพ</td>
              <td>Toyota color : White</td>
              <td>เสร็จสิ้น</td><input type="checkbox" defaultChecked="checked" className="checkbox checkbox-sm m-2" /> 
            </tr>
            {/* row 3 */}
            <tr>
              <th>3</th>
              <td>อำนาจ </td>
              <td>Isuzu color : silver</td>
              <td>เสร็จสิ้น</td><input type="checkbox" defaultChecked="checked" className="checkbox checkbox-sm m-2" />

            </tr>
          </tbody>
        </table>
          <button className="btn btn-success m-2"> เพิ่มรายการ </button>
          <button className="btn btn-error m-2">ลบรายการ</button>
      </div>
      </>
  );
}
