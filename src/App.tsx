import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';

import { TodoList } from './components/TodoList';

export const App = () => {
  const [todos, setTodos] = useState(todosFromServer);
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState<number>(0);

  const [hasTitleError, setHasTitleError] = useState(false);
  const [hasUserError, setHasUserError] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Оставляем только буквы (en, ua), цифры и пробелы
    const sanitizedTitle = e.target.value.replace(
      /[^a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9 ]/g,
      '',
    );

    setTitle(sanitizedTitle);
    setHasTitleError(false); // Прячем ошибку сразу при вводе
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(Number(e.target.value));
    setHasUserError(false); // Прячем ошибку сразу при выборе
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const isTitleInvalid = !trimmedTitle;
    const isUserInvalid = userId === 0;

    // Показываем ошибки только после нажатия на кнопку
    if (isTitleInvalid) {
      setHasTitleError(true);
    }

    if (isUserInvalid) {
      setHasUserError(true);
    }

    if (isTitleInvalid || isUserInvalid) {
      return;
    }

    const nextId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
    const selectedUser = usersFromServer.find(u => u.id === userId);

    const newTodo = {
      id: nextId,
      title: trimmedTitle,
      userId,
      completed: false,
      user: selectedUser,
    };

    setTodos([...todos, newTodo]);

    // Очищаем форму после успешного добавления
    setTitle('');
    setUserId(0);
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="titleInput">Title:</label>
          <input
            id="titleInput"
            type="text"
            data-cy="titleInput"
            placeholder="Enter a title"
            value={title}
            onChange={handleTitleChange}
          />
          {hasTitleError && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <label htmlFor="userSelect">User:</label>
          <select
            id="userSelect"
            data-cy="userSelect"
            value={userId}
            onChange={handleUserChange}
          >
            <option value={0} disabled>
              Choose a user
            </option>
            {usersFromServer.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {hasUserError && <span className="error">Please choose a user</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};
