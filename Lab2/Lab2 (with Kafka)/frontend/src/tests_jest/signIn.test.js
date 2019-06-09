import React from "react";
import signIn from "../containers/LoginPage/Login";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { mount, shallow, render } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("<signIn />", () => {
  it("render Sign in successfully", () => {
    const component = shallow(<signIn />);
    console.log(component);
    expect(component).toHaveLength(1);
  });

  it(" User login success", () => {
    const component = shallow(<signUp />);
    console.log(component);
    expect(component).toMatchSnapshot();
  });
});
