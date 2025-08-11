import pilot from "../../../assets/4569570.webp";
export const HeroCards = () => {
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      
        <img
          src={pilot}
          alt=""
          className="w-[600px] object-contain rounded-lg"
        />
    </div>
  );
};
