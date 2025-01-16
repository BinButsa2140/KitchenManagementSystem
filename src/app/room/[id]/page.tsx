import { RoomDetail } from '../../../components/Room/RoomDetail';



const RoomInfo = ({ params }: { params: { id: string } }) => {
    const  id  = String(params.id)
    console.log(id, " type of", typeof(id))

  
    return (
      <div className="m-20 md:mx-52 my-5">
        <RoomDetail id={id}/>
        
      </div>
    );
  };
  
  export default RoomInfo;
  