import CrudModulePage from '../components/ui/CrudModulePage';
import { codingProfilesApi } from '../api/endpoints';

const fields = [
  { key: 'platform', label: 'Platform (e.g. LeetCode, Codeforces)', type: 'text' },
  { key: 'username', label: 'Username', type: 'text' },
  { key: 'profileUrl', label: 'Profile URL', type: 'text' },
  { key: 'icon', label: 'Icon (react-icons name e.g. FiCode, or an image URL)', type: 'text' },
];

const columns = [
  { key: 'platform', label: 'Platform' },
  { key: 'username', label: 'Username' },
  { key: 'profileUrl', label: 'URL', render: (row) => (
    <a href={row.profileUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
      {row.profileUrl}
    </a>
  ) },
];

export default function CodingProfilesPage() {
  return (
    <CrudModulePage
      title="Coding Profiles"
      description="LeetCode, Codeforces, HackerRank, and similar links shown on the public site."
      api={codingProfilesApi}
      columns={columns}
      fields={fields}
      emptyValues={{ platform: '', username: '', profileUrl: '', icon: '' }}
    />
  );
}
