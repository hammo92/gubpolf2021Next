import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"; 
    background: #282831 !important;
  }
  #__next::after {
    content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  ${"" /* background-image: url('/view.svg'); */}
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  pointer-events: none;
  }
  select{
    background: #292d39
  }
`;

export default GlobalStyle;
