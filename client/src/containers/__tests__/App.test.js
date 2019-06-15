import React from 'react';
import '../__mocks__/matchmedia.mock';
import App from '../App/App';
import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const component = renderer.create(<App />, );
  expect(component.toJSON()).toMatchSnapshot();
});
