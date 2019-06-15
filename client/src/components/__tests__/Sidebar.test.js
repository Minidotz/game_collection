import React from 'react';
import renderer from 'react-test-renderer';
import Sidebar from '../Sidebar';
import { Drawer } from '@material-ui/core';
import { MemoryRouter} from 'react-router-dom';

jest.mock('react-dom');
jest.mock('@material-ui/core/Modal', () => 'Modal');

it('renders', () => {
    let component = renderer.create(
        <MemoryRouter>
            <Sidebar isOpen={true} />
        </MemoryRouter>
    );
    expect(component.toJSON()).toMatchSnapshot();
});

it('shows the sidebar when isOpen prop is true', () => {
    let component = renderer.create(
        <MemoryRouter>
            <Sidebar isOpen={true} />
        </MemoryRouter>
    );
    const instance = component.root;
    expect(instance.findByType(Drawer).props.open).toBeTruthy();
});

it('displays Home menu item as active on main page', () => {
    let component = renderer.create(
        <MemoryRouter initialEntries={['/']}>
            <Sidebar isOpen={true} />
        </MemoryRouter>, 
    );
    const instance = component.root;
    expect(instance.findByProps({href: '/'}).props.className).toContain('active');
});

it('displays Contact menu item as active when navigating to contact page', () => {
    let component = renderer.create(
        <MemoryRouter initialEntries={['/contact']}>
            <Sidebar isOpen={true} />
        </MemoryRouter>, 
    );
    const instance = component.root;
    expect(instance.findByProps({href: '/contact'}).props.className).toContain('active');
});