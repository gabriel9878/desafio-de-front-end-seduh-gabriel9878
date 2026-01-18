import '@testing-library/jest-dom';

jest.mock('next/image', () => {
  return function MockImage(props: any) {
    const React = require('react');
    return React.createElement('img', props);
  };
});
