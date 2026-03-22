import React, { useState } from 'react';
import './ProjectSettings.css';
import Button from '../common/Button';
import { validateProjectName } from '../../utils/validators';

interface ProjectSettingsData {
  name: string;
  description: string;
  defaultAssigneeId: string;
  archived: boolean;
}

interface ProjectSettingsProject {
  name?: string;
  description?: string;
  defaultAssigneeId?: string;
  archived?: boolean;
}

interface ProjectSettingsProps {
  project?: ProjectSettingsProject | null;
  onSave: (data: ProjectSettingsData) => void;
}

export default function ProjectSettings({ project, onSave }: ProjectSettingsProps) {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [defaultAssignee, setDefaultAssignee] = useState(project?.defaultAssigneeId || '');
  const [archived, setArchived] = useState(project?.archived || false);
  const [nameError, setNameError] = useState<string | null>(null);

  const handleSave = () => {
    const error = validateProjectName(name);
    if (error) {
      setNameError(error);
      return;
    }
    setNameError(null);
    onSave({ name, description, defaultAssigneeId: defaultAssignee, archived });
  };

  return (
    <div className="project-settings">
      <h2 className="project-settings__title">Project Settings</h2>

      <div className="project-settings__section">
        <div className="project-settings__field">
          <label className="project-settings__label">Project Name</label>
          <input
            type="text"
            className={`project-settings__input ${nameError ? 'project-settings__input--error' : ''}`}
            value={name}
            onChange={(e) => { setName(e.target.value); setNameError(null); }}
          />
          {nameError && <span className="project-settings__error">{nameError}</span>}
        </div>

        <div className="project-settings__field">
          <label className="project-settings__label">Description</label>
          <textarea
            className="project-settings__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="project-settings__field">
          <label className="project-settings__label">Default Assignee</label>
          <select
            className="project-settings__select"
            value={defaultAssignee}
            onChange={(e) => setDefaultAssignee(e.target.value)}
          >
            <option value="">None</option>
            {/* TODO: populate from project members */}
          </select>
        </div>

        <div className="project-settings__field">
          <label className="project-settings__checkbox-label">
            <input
              type="checkbox"
              checked={archived}
              onChange={(e) => setArchived(e.target.checked)}
            />
            Archive this project
          </label>
          <p className="project-settings__help">
            Archived projects are hidden from the main view but can be restored later.
          </p>
        </div>
      </div>

      <div className="project-settings__actions">
        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
