import { StarOutlined, StarFilled } from '@ant-design/icons';

const StarRating = ({ rating }) => {
  return (
    <div className="rating-result">
      {Array.from({ length: 5 }, (_, index) => (
        index < rating ? (
          <StarFilled className='star-icon' key={index} />
        ) : (
          <StarOutlined className='star-icon' key={index} />
        )
      ))}
    </div>
  );
};

export default StarRating