export default function Store() {
    return (
      <>
      <br></br>
   <h1 className="text-3xl">จัดการคลังสินค้า</h1>
   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
   <br></br>
        <div className="join">
        <div>
            <div>
            <input className="input input-bordered join-item" placeholder="Search"/>
            </div>
                </div>
                <select className="select select-bordered join-item">
                    <option disabled selected>Filter</option>
                    <option>จากมากไปน้อย</option>
                    <option>จากน้อยไปมาก</option>
                    <option>ล่าสุด</option>
                </select>
                <div className="indicator">  
            <button className="btn join-item">ค้ณหา</button>
            </div>
        </div>

        <div className="overflow-x-auto">
  <table className="table table-xs table-pin-rows table-pin-cols">
    <thead>
      <tr>
        <th></th> 
        <td>รหัสอะไหล่</td> 
        <td>ยี่ฮ้อ</td> 
        <td>ประเภท</td> 
        <td>ราคาต้น</td> 
        <td>ราคาขาย</td> 
        <td>จำนานคงเหลือ</td>
        <th></th> 
      </tr>
    </thead> 
    <tbody>
      <tr>
        <th>1</th> 
        <td>XXXX</td> 
        <td>EEEE</td> 
        <td>XXXX</td> 
        <td>TTTT</td> 
        <td>DDDD</td> 
        <td>NNNN</td>
         
      </tr>
      <tr>
        <th>2</th> 
        <td>XXXX</td> 
        <td>EEEE</td> 
        <td>XXXX</td> 
        <td>TTTT</td> 
        <td>DDDD</td> 
        <td>NNNN</td>
        
      </tr>
      <tr>
        <th>3</th> 
        <td>XXXX</td> 
        <td>EEEE</td> 
        <td>XXXX</td> 
        <td>TTTT</td> 
        <td>DDDD</td> 
        <td>NNNN</td>
      </tr>

    </tbody> 
    <tfoot>
      <tr>
        <th></th> 
        <td>Name</td> 
        <td>Job</td> 
        <td>company</td> 
        <td>location</td> 
        <td>Last Login</td> 
        <td>Favorite Color</td>
        <th></th> 
      </tr>
    </tfoot>
  </table>
</div>
   
   <label className="form-control w-full max-w-xs">
   <div className="label">
    <span className="label-text">รหัส-อะไหร่</span>       
   </div>
   <input type="text" placeholder="" className="input input-bordered w-full max-w-xs" />
   <div className="label">           
   </div>
   </label>  
   

   <label className="form-control w-full max-w-xs">
   <div className="label">
    <span className="label-text">ชื่อ-อะไหร่</span>       
   </div>
   <input type="text" placeholder="" className="input input-bordered w-full max-w-xs" />
   <div className="label">           
   </div>
   </label>

   <label className="form-control w-full max-w-xs">
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
   </div>
   </label>

   <label className="form-control w-full max-w-xs">
   <div className="label">
    <span className="label-text">ยี่ห้อ</span>       
   </div>
       <select className="select select-bordered w-full max-w-xs">
       <option disabled selected>เลือก</option>
       <option>ของแทร๊</option>
       <option>ของเทียบ</option>

       </select>
   <div className="label">           
   </div>
   </label>

   <label className="form-control w-full max-w-xs">
   <div className="label">
    <span className="label-text">ราคาต้นทุน</span>       
   </div>
   <input type="text" placeholder="" className="input input-bordered w-full max-w-xs" />
   <div className="label">           
   </div>
   </label>

   <label className="form-control w-full max-w-xs">
   <div className="label">
    <span className="label-text">ราคาขาย</span>       
   </div>
   <input type="text" placeholder="" className="input input-bordered w-full max-w-xs" />
   <div className="label">           
   </div>
   </label>

   


   <br></br></div>
   <button className="btn btn-success m-2"> บันทึก </button>
   <button className="btn btn-error m-2">ยกเลิก</button>
   <br></br>
   <span className="loading loading-infinity loading-lg"></span>
   
</>
    );
  }
  