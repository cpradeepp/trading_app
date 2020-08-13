/**
 * Entry point for the server
 */

import { start } from './index';
import { SETTINGS } from './config/prod';

start(SETTINGS, true);
