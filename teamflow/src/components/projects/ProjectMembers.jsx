import React, { useState } from 'react';
import styles from './ProjectMembers.module.css';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { PROJECT_ROLES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';

export default function ProjectMembers({ members, onInvite, onRemove, onRoleChange }) {
  const { user } = useAuth();
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    onInvite(inviteEmail);
    setInviteEmail('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Members ({members.length})</h3>
      </div>

      <div className={styles.inviteRow}>
        <input
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="Invite by email..."
          className={styles.inviteInput}
        />
        <Button variant="primary" size="sm" onClick={handleInvite}>Invite</Button>
      </div>

      <div className={styles.list}>
        {members.map(member => (
          <div key={member.id} className={styles.memberRow}>
            <div className={styles.memberInfo}>
              <Avatar user={member} size="md" />
              <div>
                <span className={styles.memberName}>
                  {member.name}
                  {member.id === user?.id && <span className={styles.youBadge}>(you)</span>}
                </span>
                <span className={styles.memberEmail}>{member.email}</span>
              </div>
            </div>
            <div className={styles.memberActions}>
              <select
                value={member.role}
                onChange={(e) => onRoleChange(member.id, e.target.value)}
                className={styles.roleSelect}
                disabled={member.role === 'owner'}
              >
                {PROJECT_ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              {member.role !== 'owner' && member.id !== user?.id && (
                <button
                  className={styles.removeBtn}
                  onClick={() => onRemove(member.id)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
