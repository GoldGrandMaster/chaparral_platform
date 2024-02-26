import {
  useLocation, useNavigate,
} from 'react-router-dom';
import { Badge } from '@/common/components/ui/badge';
function Page() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').slice(3).filter((x) => x);
  const handleClick = (index: number) => {
    navigate(location.pathname.split('/').slice(0, index + 4).join('/'));
  }

  return (
    <div className='flex items-center my-3 gap-2'>
      <Badge onClick={() => handleClick(-1)}>Project</Badge>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        return (
          <div key={index}>
            /
            <Badge onClick={() => !last && handleClick(index)}>{decodeURIComponent(value)}</Badge>
          </div>
        )
      })}
    </div>
  );
}

export default Page;