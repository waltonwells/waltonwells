import React from 'react'

const style = {
footer: ` flex  bg-[#2181e2] flex-1 bottom-[0px] w-full mt-[1rem] ` ,
footerItems:`text-[#fff] flex-1  items-center justify-between px-8 text-center my-[6rem]`
} 



const Footer = () => {
  return (
    <div className={style.footer}>
   <div className={style.footerItems}>About</div>
   <div className={style.footerItems}>About</div>
   <div className={style.footerItems}>About</div>
   <div className={style.footerItems}>About</div>
   <div className={style.footerItems}>About</div>

    </div>
  )
}

export default Footer