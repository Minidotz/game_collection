import React from 'react';
import renderer from 'react-test-renderer';
import GameList from '../GameList';
import { MemoryRouter} from 'react-router-dom';
import { Avatar } from '@material-ui/core';
import { Image } from '@material-ui/icons';

it('renders', () => {
    let testData = [{
        _id: 1,
        guid: '678-9013',
        title: 'Test game',
        image: '/img/games/678-9013.jpg'
    }];
    const component = renderer.create(
        <MemoryRouter>
            <GameList data={testData} />
        </MemoryRouter>
    );
    expect(component.toJSON()).toMatchSnapshot();
});

it('shows No data when there are no data props', () => {
    const component = renderer.create(
        <MemoryRouter>
            <GameList />
        </MemoryRouter>
    );
    const instance = component.root;
    expect(instance.findByType('em').children[0]).toBe('No data');
});

it("shows an Avatar with a generic icon when there's no image in game data", () => {
    let testData = [{
        _id: 1,
        guid: '678-9013',
        title: 'Test game'
    }]
    const component = renderer.create(
        <MemoryRouter>
            <GameList data={testData} />
        </MemoryRouter>
    );
    const instance = component.root;
    expect(instance.findByType(Avatar).findByType(Image)).toBeTruthy();
});