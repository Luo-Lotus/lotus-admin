import BTRImage from '../../components/BTRImage';

const NoPermission = () => {
  return (
    <div className="flex flex-justify-center flex-items-center flex-col w-100vw">
      <BTRImage fileName="/03.jpg" />
      <div className="font-size-8 mt-20px color-white bg-#8219ff p-10px border-rd-10px">
        不好意思，小孤独没有找到你想要的页面
      </div>
    </div>
  );
};

export default NoPermission;
