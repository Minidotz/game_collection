import React from 'react';
import renderer from 'react-test-renderer';
import Navbar from '../Navbar';
import { ArrowBack, Menu } from "@material-ui/icons";
import { IconButton } from '@material-ui/core';

const component = renderer.create(<Navbar title="Test App" showBack={true} />);
it('renders correctly', () => {
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

it('shows back button if showBack is true', () => {
    const instance = component.root;
    expect(instance.findByType(ArrowBack)).toBeTruthy();
});

it('shows menu button if showBack is false', () => {
    let component = renderer.create(<Navbar showBack={false} />);
    const instance = component.root;
    expect(instance.findByType(Menu)).toBeTruthy();
});

it('shows correct title when title prop is passed', () => {
    const instance = component.root;
    expect(instance.findByProps({variant: "h6"}).props.children).toBe("Test App");
});

it('fires goBack when back button is clicked', () => {
    const myMock = jest.fn();
    let component = renderer.create(<Navbar showBack={true} goBack={myMock} />);
    const instance = component.root;
    instance.findByType(IconButton).props.onClick();
    expect(myMock).toHaveBeenCalled();
});