/* empty css                  *//* empty css               *//* empty css                 *//* empty css                 *//* empty css                     *//* empty css                */import{u as ve,_ as me,g as N,a as _e,A as pe,b as fe,s as ge}from"./animal-wESaQSkG.js";import{d as ye,r as a,a as he,o as we,c as s,e as d,D,f as i,g as l,F as E,G as j,l as I,h as M,H as xe,I as be,J as Ae,K as Se,L as ke,j as p,t as z,k as Le,M as De,N as Ee,O as Ie,P as Me,p as Ce,Q as Be,R as Te,_ as Ve}from"./index-AMOvtFGo.js";/* empty css                  *//* empty css                  */import"./Request-ZIjCtDXO.js";function Ne(C,c,m){let o=null;return function(..._){const r=m;o!==null&&clearTimeout(o),o=setTimeout(()=>{C.apply(r,_),o=null},c)}}const je={id:"container",ref:"container",class:"container"},ze={class:"animals-nav"},Fe=["innerHTML"],He=["infinite-scroll-disabled"],Re={style:{display:"flex","flex-direction":"column","justify-content":"center","align-items":"center",height:"100px","background-color":"rgb(247,247,247)"}},Ue={key:0,class:"bottom-loading"},Ke={key:1,style:{color:"#cccccc",width:"100%",display:"flex","justify-content":"center","margin-top":"30px"}},Oe=ye({__name:"index",setup(C){const c=a(!1),m=a(!1),o=a([]),_=a(0),r=a(1),f=a(20),F=a(""),g=a(),H=he(),u=a(""),B=a(1),y=async()=>{c.value=!0;try{const e=await N(r.value,f.value,g.value,u.value,B.value);if(o.value=e.data.data,_.value=e.data.total,c.value=!1,r.value*f.value>_.value){w.value=!0;return}}catch{xe.error("获取动物列表失败"),c.value=!1;return}};we(()=>y());const R=a("1"),U=async e=>{const t=e.split("-")[1];t!==void 0&&(A.value=Number(t)),e!=="4"&&(F.value=t,g.value=v.value[A.value].id,console.log(g.value),await y())},T=a([]),A=a(0),v=a([]),K=ve();(async()=>{c.value=!0;const e=await _e();v.value=e.data.classificationList,K.setClassfication(v.value),T.value=v.value.map(t=>t.name),c.value=!1})();const O=async()=>{P.value=!0,await y()},P=a(!0),h=a([]),q=async()=>{if(u.value.trim()===""){h.value=[];return}const e=await ge(u.value);return h.value=e.data,e.data},G=e=>{u.value=e,y()},J=(e,t)=>t.replace(new RegExp(e,"g"),'<span style="color: #39c5bb">$&</span>'),w=a(!1),Q=Ne(async()=>{if(H.name!=="animals"||r.value*f.value>_.value)return;r.value++;const{data:e}=await N(r.value,f.value,g.value,u.value,B.value);if(m.value=!1,o.value=[...o.value,...e.data],e.page*e.pageSize>e.total){w.value=!0;return}},200,{leading:!1}),$=()=>{m.value=!0,Q()},S=a("添加新动物"),x=a(!1),W=e=>{x.value=e},X=async e=>{const t=await fe(e.id);b.value=t.data.animalList[0],S.value="编辑动物",k.value.showDrawer=!0},k=a(),Y=()=>{S.value="添加新动物",x.value=!0,k.value.showDrawer=!0},b=a({}),Z=()=>{x.value=!1,b.value={},b.value.imgList=[{uid:"",url:""}]},ee=async(e,t)=>{if(e.trim().length===0)return t(h.value);await q(),t(h.value)},ae=e=>{u.value=e.name,O()},te=e=>{};return(e,t)=>{const L=Ee,ne=Ie,le=Me,oe=Ce,se=Be,ie=be,ce=Ae,ue=Te,V=Se,re=ke;return s(),d(E,null,[D((s(),d("div",je,[i(ie,{offset:0},{default:l(()=>[M("div",ze,[i(le,{"default-active":R.value,"active-text-color":"rgb(213,253,157)","background-color":"#545c64",class:"el-menu-demo",mode:"horizontal","text-color":"#fff",onSelect:U},{default:l(()=>[i(L,{index:"1"},{default:l(()=>[p("全部")]),_:1}),i(ne,{index:"2",style:{"padding-bottom":"10px"}},{title:l(()=>{var n;return[p(z((n=v.value[A.value])==null?void 0:n.name),1)]}),default:l(()=>[(s(!0),d(E,null,j(v.value,(n,de)=>(s(),I(L,{key:n,index:"2-"+de},{default:l(()=>[p(z(n.name),1)]),_:2},1032,["index"]))),128))]),_:1}),i(L,{index:"3"},{default:l(()=>[p("世界之最")]),_:1})]),_:1},8,["default-active"]),i(se,{modelValue:u.value,"onUpdate:modelValue":t[0]||(t[0]=n=>u.value=n),"fetch-suggestions":ee,placeholder:"可爱的动物(≧∇≦)ﾉ","popper-class":"my-autocomplete",onChange:G,onSelect:ae},{suffix:l(()=>[i(oe,{class:"el-input__icon",style:{cursor:"pointer"},onClick:te},{default:l(()=>[i(Le(De))]),_:1})]),default:l(({item:n})=>[M("div",{class:"value",innerHTML:J(u.value,n.name)},null,8,Fe)]),_:1},8,["modelValue"])])]),_:1}),i(ce,{color:"#39c5bb",icon:"Plus",plain:"",style:{"margin-bottom":"20px"},onClick:Y},{default:l(()=>[p("添加动物 ")]),_:1}),o.value.length>0?D((s(),d("div",{key:0,"infinite-scroll-disabled":w.value,class:"animals-container"},[(s(!0),d(E,null,j(o.value,n=>D((s(),I(pe,{key:n.id,animalData:n,drawer:x.value,class:"animal-item",onUpdateDrawer:W,onInitAnimal:X},null,8,["animalData","drawer"])),[[V,c.value]])),128))],8,He)),[[re,$]]):(s(),I(ue,{key:1,description:"这里什么也没有哟~"})),M("div",Re,[m.value&&!w.value?(s(),d("div",Ue)):(s(),d("div",Ke," 没有更多了哟~ "))])])),[[V,c.value]]),i(me,{ref_key:"animalDrawer",ref:k,"add-animal-forms":b.value,drawer_title:S.value,options:T.value,onClose:Z},null,8,["add-animal-forms","drawer_title","options"])],64)}}}),na=Ve(Oe,[["__scopeId","data-v-b4dce45c"]]);export{na as default};
