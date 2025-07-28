import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('src/auth/test/auth.feature');

defineFeature(feature, (test) => {});
