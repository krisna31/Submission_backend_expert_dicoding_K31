const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const GetThreadUseCase = require("../GetThreadByIdUseCase");
const ReplyRepository = require("../../../Domains/replies/RepliesRepository");

describe("GetThreadUseCase", () => {
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
    };

    const mockAddedThread = {
      id: "thread-123",
      title: "ini judul thread",
      body: "ini isi thread",
      date: "2023",
      username: "31",
    }

    const mockAddedComments = [
      {
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
        username: "31",
        date: "2023",
        content: "ini isi komentar",
        is_deleted: false,
      },
    ]

    const mockAddedReplies = [
      {
        id: "reply-123",
        content: "ini isi balasan",
        date: "2023",
        username: "krisna",
        owner: "user-123",
        comment_id: "comment-123",
        is_deleted: false,
      },
    ]

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => 
    Promise.resolve(mockAddedThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() => 
    Promise.resolve(mockAddedComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn().mockImplementation(() => 
    Promise.resolve(mockAddedReplies));

    const mockGetThreadUseCase = new GetThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      repliesRepository: mockReplyRepository,
    });

    // Action
    const theThread = await mockGetThreadUseCase.execute(useCasePayload.threadId);

    // Assert
    expect(theThread).toStrictEqual({
      id: "thread-123",
      title: "ini judul thread",
      body: "ini isi thread",
      date: "2023",
      username: "31",
      comments: [
        {
          id: 'comment-123',
          username: '31',
          date: '2023',
          content: 'ini isi komentar',
          replies: [{
            id: "reply-123",
            content: "ini isi balasan",
            date: "2023",
            username: "krisna",
          }],
        },
      ],
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCasePayload.threadId);
  });

  it("should not display deleted comment", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
    };

    const mockAddedThread = {
      id: "thread-123",
      title: "ini judul thread",
      body: "ini isi thread",
      date: "2023",
      username: "31",
    }

    const mockAddedComments = [
      {
        id: "comment-123",
        username: "31",
        date: "2023",
        content: "**komentar telah dihapus**",
        is_deleted: true,
      },
    ];

    const mockAddedReplies = [
      {
        id: "reply-123",
        content: "**balasan telah dihapus**",
        date: "2023",
        username: "krisna",
        comment_id: "comment-123",
        is_deleted: true,
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(mockAddedThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve(mockAddedComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn().mockImplementation(() => Promise.resolve(mockAddedReplies));

    const mockGetThreadUseCase = new GetThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      repliesRepository: mockReplyRepository,
    });

    // Action
    const theThread = await mockGetThreadUseCase.execute(useCasePayload.threadId);

    // Assert
    expect(theThread).toStrictEqual({
      id: "thread-123",
      title: "ini judul thread",
      body: "ini isi thread",
      date: "2023",
      username: "31",
      comments: [
        {
          id: "comment-123",
          username: "31",
          date: "2023",
          content: "**komentar telah dihapus**",
          replies: [{
            id: "reply-123",
            content: "**balasan telah dihapus**",
            date: "2023",
            username: "krisna",
          }],
        },
      ],
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCasePayload.threadId);
  });
});
