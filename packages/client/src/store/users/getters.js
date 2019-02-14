export const user = ({ user }) => user
export const profile = ({ profile }) => profile
export const header = ({ profile }) => profile && profile.header
export const details = ({ profile }) => profile && profile.details
export const articles = ({ profile }) => profile && profile.articles
export const projects = ({ profile }) => profile && profile.projects
