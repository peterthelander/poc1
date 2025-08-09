import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import React from 'react';

import HomeScreen from '../HomeScreen';

describe('HomeScreen', () => {
  it('renders Ask button', () => {
    const navigation: any = { navigate: jest.fn() };
    const route: any = { key: 'Home', name: 'Home' };
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen navigation={navigation} route={route} />
      </NavigationContainer>,
    );
    expect(getByText('Ask')).toBeTruthy();
  });
});
