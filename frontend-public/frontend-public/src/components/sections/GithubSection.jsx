import { motion } from 'framer-motion';
import { FiGithub, FiStar, FiGitBranch } from 'react-icons/fi';
import SectionHeading from '../common/SectionHeading';
import EmptyState from '../common/EmptyState';
import useFetch from '../../hooks/useFetch';
import api from '../../api/endpoints';

export default function GithubSection() {
  const { data: github, loading } = useFetch(api.getGithub, []);

  return (
    <section id="github" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="GitHub" title="Open source & code" />
      {loading ? (
        <div className="glass-card h-48 animate-pulse" />
      ) : !github ? (
        <EmptyState message="GitHub data will appear here once the integration is configured." />
      ) : (
        <>
          <div className="glass-card mb-8 flex flex-wrap items-center gap-6 p-6">
            <img
              src={github.profile?.avatarUrl}
              alt={github.profile?.login}
              className="h-16 w-16 rounded-full"
            />
            <div>
              <a
                href={github.profile?.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 font-display text-lg font-semibold hover:underline"
              >
                <FiGithub /> {github.profile?.login}
              </a>
              <p className="text-sm text-slate-400">{github.profile?.bio}</p>
            </div>
            <div className="ml-auto flex gap-6 font-mono text-sm text-slate-300">
              <span>{github.profile?.followers} followers</span>
              <span>{github.profile?.publicRepos} repos</span>
              <span>{github.contributions?.totalContributions} contributions</span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(github.pinnedRepos || []).map((repo, i) => (
              <motion.a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card block p-5"
              >
                <h3 className="font-medium">{repo.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-400">{repo.description}</p>
                <div className="mt-3 flex items-center gap-4 font-mono text-xs text-slate-500">
                  {repo.language && <span>{repo.language}</span>}
                  <span className="flex items-center gap-1">
                    <FiStar /> {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiGitBranch /> {repo.forks}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
