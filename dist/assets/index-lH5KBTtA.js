/* empty css                  *//* empty css               *//* empty css                 *//* empty css                        *//* empty css                     *//* empty css                 */import{d as M,r as u,o as T,S as A,D as j,c as p,e as S,l as h,g as l,H as s,U as m,V as H,K as I,f as n,j as y,t as x,k as w,M as U,W as _,X as R,Y as N,Z as J,$ as K,a0 as W,J as X,R as Y}from"./index-AMOvtFGo.js";import{a as Z,b as q,u as F,d as G}from"./Admin-AgsqLEaY.js";import{u as O}from"./Request-ZIjCtDXO.js";const rt=M({__name:"index",setup(P){const o=u(!1),f=O(),r=u([]),v=async()=>{o.value=!0;try{const i=await Z();o.value=!1,r.value=i.data.adminList}catch{s.error("获取管理员列表失败"),o.value=!1;return}};T(()=>v());const d=u(""),b=A(()=>r.value.filter(i=>!d.value||i.name.toLowerCase().includes(d.value.toLowerCase()))),k=async(i,e)=>{var t;if(((t=f.admin)==null?void 0:t.adminID.toString())!=="1"){s.error("当前登录账号权限不足！");return}m.confirm(`确定要${e.status==1?"禁用":"启用"}该管理员吗？`,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(async()=>{s.success(`${e.status==1?"禁用":"启用"}成功`),r.value.splice(i,1,{...e,status:e.status==1?0:1});let c=e.status==1?0:1;await F(e.adminID,c),await v()}).catch(()=>{s.info("已取消")})},C=async(i,e)=>{if(f.admin.adminID.toString()!=="1"){s.error("当前登录账号权限不足！");return}m.confirm("确定要删除该管理员吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(async()=>{s.success("删除成功"),await G(e.adminID)}).catch(()=>{s.info("已取消")})},L=async i=>{o.value=!0;const{data:{data:e}}=await q(i.adminID);let t=e.admin;o.value=!1,m.alert(` <div
        style="
        display: flex;
        justify-content: end;
        align-items: end;
        flex-direction: column;
        width: 350px;
        height: 350px;
        border: 1px dashed rgb(213, 253, 157);
        background-image: url(${t.bgcImgURL});
        background-position: top center;
        background-size: 100% 40%;
        background-repeat: no-repeat;
        position: relative;
      "
    >
      <img
        src="${i.avatarURL}"
        alt=""
        width="70px"
        height="70px"
        style="
          background-color: rgba(135, 206, 235, 0.5);
          border-radius: 50%;
          position: absolute;
          top: 40%;
          left: 2%;
          transform: translate(0, -50%);
        "
      />
      <div style="position: absolute; top: 55%; left: 6%">${i.name}</div>
      <div style="width: 65%; height: 75px; margin-bottom: 15px">
        ${t.message}
      </div>
      <div
        style="
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          height: 100px;
        "
      >
        <div
          style="
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            flex: 1;
          "
        >
        <div style="display: flex; width: 100%; justify-content: center">
          总审核数
          <svg style="width: 20px;color:#85ce61;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-ea893728=""><path fill="currentColor" d="M805.504 320 640 154.496V320zM832 384H576V128H192v768h640zM160 64h480l256 256v608a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32m318.4 582.144 180.992-180.992L704.64 510.4 478.4 736.64 320 578.304l45.248-45.312z"></path></svg>
        </div>
          <div style="font-size: 28px">${t.audit.length}</div>
        </div>
        <div
          style="
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            flex: 1;
          "
        >
        <div style="display: flex; width: 100%; justify-content: center">
          总添加数
          <svg style="width: 20px ;color:#66b1ff;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-ea893728=""><path fill="currentColor" d="M160 832h704a32 32 0 1 1 0 64H160a32 32 0 1 1 0-64m384-578.304V704h-64V247.296L237.248 490.048 192 444.8 508.8 128l316.8 316.8-45.312 45.248z"></path></svg>
        </div>
          <div style="font-size: 28px">${t.addCount.length}</div>
        </div>
        <div
          style="
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            flex: 1;
          "
        >
          <div style="display: flex; width: 100%; justify-content: center">
            总修改数<svg
              style="width: 20px"
              color="#85ce61"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              data-v-ea893728=""
            >
              <path
                fill="currentColor"
                d="M832 512a32 32 0 1 1 64 0v352a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h352a32 32 0 0 1 0 64H192v640h640z"
              ></path>
              <path
                fill="currentColor"
                d="m469.952 554.24 52.8-7.552L847.104 222.4a32 32 0 1 0-45.248-45.248L477.44 501.44l-7.552 52.8zm422.4-422.4a96 96 0 0 1 0 135.808l-331.84 331.84a32 32 0 0 1-18.112 9.088L436.8 623.68a32 32 0 0 1-36.224-36.224l15.104-105.6a32 32 0 0 1 9.024-18.112l331.904-331.84a96 96 0 0 1 135.744 0z"
              ></path>
            </svg>
          </div>
          <div style="font-size: 28px">${t.editCount.length}</div>
        </div>
      </div>
    </div>`,"详情",{dangerouslyUseHTMLString:!0,center:!0})};return(i,e)=>{const t=N,c=J,D=K,$=W,g=X,z=H,B=Y,E=I;return j((p(),S("div",null,[r.value.length>=1?(p(),h(z,{key:0,data:b.value,stripe:"",style:{width:"100%"},onRowClick:L},{default:l(()=>[n(t,{label:"管理员",prop:"name"}),n(t,{label:"头像",prop:"avatarURL"},{default:l(a=>[n(c,{src:a.row.avatarURL,style:{width:"25%"}},null,8,["src"])]),_:1}),n(t,{label:"创建时间",prop:"createTime"}),n(t,{label:"账号状态",prop:"status"},{default:l(a=>[n(D,{type:a.row.status===1?"success":"danger",effect:"light"},{default:l(()=>[y(x(a.row.status===1?"正常":"禁用中"),1)]),_:2},1032,["type"])]),_:1}),n(t,{align:"right"},{header:l(()=>[n($,{modelValue:d.value,"onUpdate:modelValue":e[0]||(e[0]=a=>d.value=a),"prefix-icon":w(U),class:"w-50 m-2",placeholder:"搜索",style:{width:"80%"}},null,8,["modelValue","prefix-icon"])]),default:l(a=>[n(g,{type:a.row.status==1?"primary":"warning",plain:"",size:"small",onClick:_(V=>k(a.$index,a.row),["stop"])},{default:l(()=>[y(x(a.row.status===1?"禁用":"启用"),1)]),_:2},1032,["type","onClick"]),n(g,{icon:w(R),circle:"",plain:"",size:"small",type:"danger",onClick:_(V=>C(a.$index,a.row),["stop"])},null,8,["icon","onClick"])]),_:1})]),_:1},8,["data"])):(p(),h(B,{key:1,description:"这里什么也没有哟~"}))])),[[E,o.value]])}}});export{rt as default};
