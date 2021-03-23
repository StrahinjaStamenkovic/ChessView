using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChessController : ControllerBase
    {
        public ChessContext Context { get; set; }
        public ChessController(ChessContext context)
        {
            Context = context;
        }

        [Route("GetArchive")]
        [HttpGet]
        public Archive GetArchive()
        {
            return Context.ChessArchive.Include(p => p.Games).FirstOrDefault();
        }
        [Route("DeleteArchive/{id}")]
        [HttpPost]
        public async Task<IActionResult> DeleteArchive(int id)
        {

            var archive = Context.ChessArchive.Where(a => a.ID == id).FirstOrDefault();
            Context.ChessArchive.Remove(archive);
            await Context.SaveChangesAsync();
            return Ok();
        }
        [Route("GetPlayer/{id}")]
        [HttpGet]
        public async Task<ChessPlayer> GetPlayer(int id)
        {
            return await Context.Players.Where(p => p.ID == id).FirstOrDefaultAsync();
        }


        [Route("DeleteGame/{gameID}/{whitePlayerID}/{blackPlayerID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteGame(int gameID, int whitePlayerID, int blackPlayerID)
        {
            var archive = Context.ChessArchive.Include(p => p.Games).FirstOrDefault();
            if (!archive.Games.Any(t => t.ID == gameID && t.WhitePlayerID == whitePlayerID && t.BlackPlayerID == blackPlayerID))
                return BadRequest(new { Message = $"Game with the key ({ gameID }) doesn't exist in the database!" });

            var whitePlayer = Context.Players.Where(player => player.ID == whitePlayerID).FirstOrDefault();
            var blackPlayer = Context.Players.Where(player => player.ID == blackPlayerID).FirstOrDefault();
            if (whitePlayer == null || blackPlayer == null)
                return BadRequest(new { Message = $"Player doesn't exist in the database!" });

            Context.Players.Remove(whitePlayer);
            Context.Players.Remove(blackPlayer);

            var game = archive.Games.Where(g => g.ID == gameID).FirstOrDefault();
            archive.Games.Remove(game);/**/

            await Context.SaveChangesAsync();
            return Ok();
        }

        /* For testing purposes */
        /*
        [Route("DeleteGameOnly/{gameID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteGameOnly(int gameID)
        {
            var archive = Context.ChessArchive.Include(p => p.Games).FirstOrDefault();
            if (!archive.Games.Any(t => t.ID == gameID))
                return BadRequest(new { Message = $"Game with the key ({ gameID }) doesn't exist in the database!" });

            var game = archive.Games.Where(g => g.ID == gameID).FirstOrDefault();
            archive.Games.Remove(game);

            await Context.SaveChangesAsync();
            return Ok();
        }
        [Route("DeletePlayerOnly/{playerID}")]
        [HttpDelete]
        public async Task<IActionResult> DeletePlayerOnly(int playerID)
        {

            var Player = Context.Players.Where(player => player.ID == playerID).FirstOrDefault();

            Context.Players.Remove(Player);

            await Context.SaveChangesAsync();
            return Ok();
        }
        */
        [Route("UpdateGame")]
        [HttpPut]
        public async Task<IActionResult> UpdateGame([FromBody] GameInfo gi)
        {
            var game = Context.ChessArchive.Include(p => p.Games).FirstOrDefault().Games.Where(g => g.ID == gi.ID).FirstOrDefault();

            if (game == null)
                return BadRequest(new { Message = $"Game doesn't exist in the database!" });

            game.PGN = gi.PGN;

            await Context.SaveChangesAsync();
            return Ok(new
            {
                idWhite = game.WhitePlayerID,
                idBlack = game.BlackPlayerID
            });
        }

        [Route("UpdatePlayer")]
        [HttpPut]
        public async Task<IActionResult> UpdatePlayer([FromBody] ChessPlayer player)
        {
            var p = Context.Players.Where(p => p.ID == player.ID).FirstOrDefault();

            if (p == null)
                return BadRequest(new { Message = $"Player doesn't exist in the database!" });

            //p.PGN = gi.PGN;
            p.Name = player.Name;
            p.LastName = player.LastName;
            p.Elo = player.Elo;
            p.Nationality = player.Nationality;
            p.Age = player.Age;

            await Context.SaveChangesAsync();
            return Ok();
        }

        [Route("AddPlayer")]
        [HttpPost]
        public async Task<IActionResult> AddPlayer([FromBody] ChessPlayer player)
        {
            Context.Players.Add(player);
            await Context.SaveChangesAsync();
            return Ok(player.ID);
        }
        [Route("AddGame")]
        [HttpPost]
        public async Task<IActionResult> AddGame([FromBody] GameInfo gi)
        {
            Context.ChessArchive.Include(p => p.Games).FirstOrDefault().Games.Add(gi);
            await Context.SaveChangesAsync();
            return Ok();
        }
    }
}