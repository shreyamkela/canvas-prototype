import React from "react";
import signUp from "../containers/LoginPage/Register";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { mount, shallow, render } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("<signUp />", () => {
  it("render Sign up successfully", () => {
    const component = shallow(<signUp />);
    console.log(component);
    expect(component).toHaveLength(1);
  });

  it(" Sign up successfully", () => {
    const component = shallow(<signUp />);
    console.log(component);
    expect(component).toMatchSnapshot(1);
  });
});
