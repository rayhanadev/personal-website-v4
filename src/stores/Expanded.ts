import { atom } from 'nanostores';

type States = 'wave' | 'message' | 'none';

// State for custom message expansion
// on /guestbook.
const expanded = atom<States>('none');
export default expanded;
