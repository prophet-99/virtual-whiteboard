import { useLayoutEffect } from 'react';

/**
 * Custom hook to disable the pull down refresh in mobile
 */
const usePulldownRefresh = () => {
  useLayoutEffect(() => {
    document.querySelector('html').classList.add('disable-pulldown-refresh-wb');
    document.querySelector('body').classList.add('disable-pulldown-refresh-wb');
    return () => {
      document
        .querySelector('html')
        .classList.remove('disable-pulldown-refresh-wb');
      document
        .querySelector('body')
        .classList.remove('disable-pulldown-refresh-wb');
    };
  }, []);
};

export default usePulldownRefresh;
