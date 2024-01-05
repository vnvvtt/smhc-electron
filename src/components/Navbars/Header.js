import React from "react";
import "./Header.css";
import { FaBars, FaTimes } from "react-icons/fa";

// import SearchIcon from "@material-ui/icons/Search";
// import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";

function Header() {
    const [isOpen, setIsOpen] = React.useState(false);
    const sidebarToggle = React.useRef();
    const openSidebar = () => {
        document.documentElement.classList.toggle("nav-open");
        sidebarToggle.current.classList.toggle("toggled");
        setIsOpen(!isOpen);
    };

    return (
        <div className="header">

            <div className="header__search">
                {/* <input className="header__searchInput" type="text" /> */}
                {/* <SearchIcon className="header__searchIcon" /> */}
                {/* <i className="fa fa-search" aria-hidden="true"></i> */}
                <div className="navbar-toggle">
                    <button
                        type="button"
                        ref={sidebarToggle}
                        className="custom-toggler"
                        onClick={() => openSidebar()}
                        style={{ strokeWidth: '2px', width: '20px' }}
                    >
                        {isOpen ? <FaTimes style={{ strokeWidth: '2px', width: '20px' }} /> : <FaBars style={{ strokeWidth: '2px', width: '20px' }} />}
                    </button>
                </div>
            </div>

            <div className="header__nav">

                <div className="header__option">
                    <span className="header__optionLineOne">Hello Guest</span>
                    <span className="header__optionLineTwo">Sign In</span>
                </div>



                <div className="header__option">
                    <span className="header__optionLineOne">Returns</span>
                    <span className="header__optionLineTwo">& Orders</span>
                </div>



                <div className="header__option">
                    <span className="header__optionLineOne">Your</span>
                    <span className="header__optionLineTwo">Prime</span>
                </div>


                <div className="header__optionBasket">
                    <i className="fa fa-shopping-basket" aria-hidden="true"></i>
                    <span className="header__optionLineTwo header__basketCount">
                        0
                    </span>
                </div>

            </div>
        </div>
    );
}

export default Header;
