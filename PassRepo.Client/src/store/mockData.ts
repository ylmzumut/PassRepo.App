import type { VaultItem } from '../types';

export const MOCK_VAULT_ITEMS: VaultItem[] = [
    {
        id: '1',
        serviceName: 'Garanti BBVA',
        username: '12345678',
        password: 'bankpassword',
        category: 'Banka',
        url: 'garantibbva.com.tr'
    },
    {
        id: '2',
        serviceName: 'WiFi Ev', // No username scenario
        password: 'supersecretwifipassword',
        category: 'Genel',
        url: 'wifi' // Special case for logo maybe? or generic
    },
    {
        id: '3',
        serviceName: 'Netflix',
        username: 'umut.netflix@gmail.com',
        password: 'moviepassword',
        category: 'Genel',
        url: 'netflix.com'
    },
    {
        id: '4',
        serviceName: 'Gmail',
        username: 'umut.yilmaz@gmail.com',
        password: 'googlepassword',
        category: 'Mail',
        url: 'google.com'
    },
    {
        id: '5',
        serviceName: 'Twitter', // Social category
        username: '@umutylmz',
        password: 'twitterpassword',
        category: 'Sosyal',
        url: 'twitter.com'
    },
    {
        id: '6',
        serviceName: 'Apple ID',
        username: 'umut.apple@icloud.com',
        password: 'appleidpassword',
        category: 'Genel',
        url: 'apple.com'
    },
];
