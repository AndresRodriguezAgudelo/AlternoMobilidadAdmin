import { InputSearch } from '../inputs/inputSearch';
import { FatButton } from '../buttons/fatButton/';
import { ArrowBack } from '@mui/icons-material';
import { IconButton } from '../buttons/iconButton';
import './styled.css';

interface CallToAction {
  label: string;
  onClick: () => void;
}

interface TitleSearchProps {
  label: string;
  onSearch?: (value: string) => void;
  subTitle?: string;
  callToAction?: CallToAction;
  progressScreen: boolean;
  onBack?: () => void;
}

export const TitleSearch = ({ 
  label, 
  onSearch, 
  subTitle,
  callToAction,
  progressScreen,
  onBack
}: TitleSearchProps) => {
  return (
    <div className="title-search-container">
      <div className="title-search-text">
        <div className='title-arrow-container' >
        {progressScreen && (
          <IconButton
            Icon={ArrowBack}
            onClick={onBack || (() => {})}
            backgroundColor="white"
            color="black"
          />
        )}
        <h1 className="title-search-label">{label}</h1>
        </div>
        {subTitle && <p className="title-search-subtitle">{subTitle}</p>}
      </div>
      {callToAction ? (
        <FatButton 
          label={callToAction.label} 
          onClick={callToAction.onClick} 
        />
      ) : (
        onSearch && <InputSearch onChange={onSearch} />
      )}
    </div>
  );
};
