export default function Check_repairs() {
    return (
        <>
        <br></br>
        <h1 className="text-3xl">ตรวจการบริการ</h1><br></br>
     

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <label className="form-control w-full max-w-xs">
        <div className="label">
         <span className="label-text">ตรวจสอบการซ่อม</span>       
        </div>
        <input type="text" placeholder="" className="input input-bordered w-full max-w-xs px-8 py-2" />
        <br></br>
                <div className="dropdown">
                <div tabIndex={0} role="button" className="btn px-8 py-2 m-2">ตรวจสอบการซ่อม</div>
                <div tabIndex={0} className="dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-primary text-primary-content">
                    <div className="card-body">
                    <h3 className="card-title">ไม่พบ</h3>
                    <p>ไม่ได้เชื่อมต่อระบบ MongoDB</p>
                    </div>
                </div>
                </div>

        <div className="label">           
        </div>
        </label>  
        </div>
       
        </>
    );
  }
  