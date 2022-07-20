import { useLayoutEffect } from 'react';

/**
 * Custom hook to disable the pull down refresh in mobile
 */
const usePulldownRefresh = () => {
  useLayoutEffect(() => {
    document.querySelector('html').classList.add('wb-disable-pulldown-refresh');
    document.querySelector('body').classList.add('wb-disable-pulldown-refresh');
    return () => {
      document
        .querySelector('html')
        .classList.remove('wb-disable-pulldown-refresh');
      document
        .querySelector('body')
        .classList.remove('wb-disable-pulldown-refresh');
    };
  }, []);
};

export default usePulldownRefresh;
