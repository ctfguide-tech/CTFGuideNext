import { StandardNav } from '@/components/StandardNav';
import Head from 'next/head';

const Loader = ({ isLoad, otherNav }) => {
  return (
    <>
      {
        otherNav && otherNav
      }
      { isLoad &&  <i className="fas fa-spinner fa-pulse"
        style={{color: "gray", fontSize: "50px", position: "absolute", marginLeft: "50%", marginTop: "20%"}}>
      </i>
      }
    </>
  )
}

export default Loader;
