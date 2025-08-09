import React from "react";
import { render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../HomeScreen";

describe("HomeScreen", () => {
  it("renders title", () => {
    const navigation: any = { navigate: jest.fn() };
    const route: any = { key: "Home", name: "Home" };
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen navigation={navigation} route={route} />
      </NavigationContainer>
    );
    expect(getByText("Home Screen")).toBeTruthy();
  });
});
