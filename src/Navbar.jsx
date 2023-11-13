import { Link, redirect } from "react-router-dom"
import './Navbar.css'
import { useContext, useEffect } from "react"
import { PeerContext } from "./Context"
export default ()=>{

    

    const navlinkclasses=' pad-t-xs pad-b-xs pad-l-xs pad-r-xs mar-r-xxs  justify-center nav-link css-bold no-underline type-sm flex flex-items-center justify-center color-cobalt-600 link-text3'

    const attIcon = <a class="brand" aria-label="AT&amp;T home" aria-disabled="false" target="_self" href="https://www.att.com/"><i id="z1-globe-md" class="icon-att-globe" aria-hidden="true"><svg height="28" viewBox="0 0 36 36" width="28"><path d="m7.1 32c3 2.3 6.8 3.7 10.9 3.7 4.5 0 8.6-1.7 11.7-4.4-1.4.9-5.4 3-11.7 3-5.5 0-9-1.2-10.9-2.3m12.1.9c4.4 0 9.2-1.2 12-3.6.8-.6 1.5-1.5 2.2-2.6.4-.7.8-1.5 1.1-2.2-2.7 3.9-10.4 6.4-18.4 6.4-5.6 0-11.7-1.8-14.1-5.3 2.2 4.8 8.9 7.3 17.2 7.3m-4.8-7.8c-9.1 0-13.4-4.2-14.1-7.1 0 1 .1 2.2.3 3.1.1.4.4 1 .9 1.6 2.2 2.3 7.7 5.5 17.2 5.5 12.9 0 15.9-4.3 16.5-5.7.4-1 .7-2.8.7-4.4v-1c-.9 3.4-11.9 8-21.5 8m-12.5-14.7c-.5 1-1.1 2.8-1.3 3.7-.1.4 0 .6.1.9 1.1 2.3 6.6 6 19.4 6 7.8 0 13.9-1.9 14.9-5.4.2-.6.2-1.3 0-2.2-.3-1-.7-2.2-1.2-3.1.1 4.6-12.7 7.6-19.2 7.6-7 0-12.9-2.8-12.9-6.3.1-.5.2-.9.2-1.2m27.8-5.7c.1.1.1.2.1.4 0 2-6 5.4-15.6 5.4-7.1 0-8.4-2.6-8.4-4.3 0-.6.2-1.2.7-1.8-.9.9-1.7 1.7-2.5 2.7-.3.4-.5.8-.5 1 0 3.5 8.7 5.9 16.7 5.9 8.6 0 12.5-2.8 12.5-5.3 0-.9-.3-1.4-1.2-2.4-.6-.6-1.2-1.1-1.8-1.6m-2.6-1.9c-2.7-1.6-5.7-2.5-9.1-2.5s-6.5.9-9.2 2.6c-.8.4-1.3.8-1.3 1.3 0 1.5 3.5 3.1 9.7 3.1 6.1 0 10.9-1.8 10.9-3.5.1-.3-.3-.6-1-1" fill="#009fdb"></path></svg></i></a>
    return(
        <div className="full-width-background bg-white custom-shadow z2">
            
            <div className="bg-white full-width-background flex pad-l-md pad-r-md bg-white-custom">
                <div className={navlinkclasses}>{attIcon}</div>
                <Link className={navlinkclasses+" flex-end"} to='/'>Home </Link>
                
            </div>
        </div>
    )
}