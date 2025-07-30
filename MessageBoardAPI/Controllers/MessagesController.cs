using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MessageBoardAPI.Data;
using MessageBoardAPI.Models;
using MessageBoardAPI.DTOs;

namespace MessageBoardAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly MessageBoardContext _context;

        public MessagesController(MessageBoardContext context)
        {
            _context = context;
        }

        // GET: api/messages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageResponseDto>>> GetMessages()
        {
            var messages = await _context.Messages
                .OrderByDescending(m => m.CreatedAt)
                .Select(m => new MessageResponseDto
                {
                    Id = m.Id,
                    Name = m.Name,
                    Email = m.Email,
                    Message = m.Content,
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();

            return Ok(messages);
        }

        // GET: api/messages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MessageResponseDto>> GetMessage(int id)
        {
            var message = await _context.Messages.FindAsync(id);

            if (message == null)
            {
                return NotFound();
            }

            var messageDto = new MessageResponseDto
            {
                Id = message.Id,
                Name = message.Name,
                Email = message.Email,
                Message = message.Content,
                CreatedAt = message.CreatedAt
            };

            return Ok(messageDto);
        }

        // POST: api/messages
        [HttpPost]
        public async Task<ActionResult<MessageResponseDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var message = new Message
            {
                Name = createMessageDto.Name,
                Email = createMessageDto.Email,
                Content = createMessageDto.Message,
                CreatedAt = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            var messageResponseDto = new MessageResponseDto
            {
                Id = message.Id,
                Name = message.Name,
                Email = message.Email,
                Message = message.Content,
                CreatedAt = message.CreatedAt
            };

            return CreatedAtAction(nameof(GetMessage), new { id = message.Id }, messageResponseDto);
        }

        // DELETE: api/messages/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            var message = await _context.Messages.FindAsync(id);
            if (message == null)
            {
                return NotFound();
            }

            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 