import json
import random
import pandas as pd
from flask import Flask, render_template, request, redirect,  Response
from flask import jsonify, url_for
app = Flask(__name__)

data = pd.read_csv('data/Seasons_Stats.csv', low_memory=False)

attrs = { '3 Pointers': 34, '2 Pointers': 37, 'Field Goals':  31, 'Steals': 48, 'Blocks': 49, 'Off. Rebounds': 44, 'Def. Rebounds': 45, 'Assists': 47, 'Games': 6, 'Free Throws': 41, 'Points': 52}

@app.route('/')
def d3():
	return render_template('index.html')


@app.route('/<string:page_name>/')
def render_static(page_name):
	return render_template('%s' % page_name)

@app.route('/specials')
def spl_stats():
	stats_dict = {}
	games = player_stats(6, True, 1980, 2018)
	stats_dict['games'] = games
	points = player_stats(52, True, 1980, 2018)
	stats_dict['points'] = points
	assists = player_stats(47, True, 1980, 2018)
	stats_dict['assists'] = assists
	rebounds = player_stats(46, True, 1980, 2018)
	stats_dict['rebounds'] = rebounds
	blocks = player_stats(49, True, 1980, 2018)
	stats_dict['blocks'] = blocks
	steals = player_stats(48, True, 1980, 2018)
	stats_dict['steals'] = steals
	stats_dict['players'] = list(games.keys())
	return pd.json.dumps(stats_dict)


def player_stats(attribute, specials = False, year1 = 1980, year2 = 2018):
	global data
	player_dict = {}
	for row in data.itertuples():
		year = int(row[1])
		player = row[2]
		value = row[attribute]
		if specials and player[-1] != "*":
			continue
		if player[-1] == '*':
			player = player[:-1]
		if player not in player_dict:
			player_dict[player] = {}
			for i in range(year1, year2, 1):
				player_dict[player][i] = 0
		player_dict[player][year] += value
	player_games = {}
	# print(player_dict)
	for player in player_dict:
		player_games[player] = []
		for year in player_dict[player]:
			player_games[player].append({'Year': year, 'Attribute': player_dict[player][year]})
	return player_games

def player_team_stats(specials = False, year1 = 1980, year2 = 2018, team_filter = False, teams = []):
	global data
	player_dict = {}
	for row in data.itertuples():
		year = int(row[1])
		player = row[2]
		team = row[5]
		if year < int(year1) or year > int(year2):
			continue
		if specials and player[-1] != "*":
			continue
		if team_filter and team not in teams:
			continue
		if player[-1] == '*':
			player = player[:-1]
		
		if player not in player_dict:
			player_dict[player] = {}
		if team not in player_dict[player]:
			player_dict[player][team] = [0,0,0,0,0,0]
		
		player_dict[player][team][0] += row[6]  # games
		player_dict[player][team][1] += row[52]  # points
		player_dict[player][team][2] += row[47]  # assists
		player_dict[player][team][3] += row[46]  # rebounds
		player_dict[player][team][4] += row[49]  # blocks
		player_dict[player][team][5] += row[48]  # steals
	dict_list = {}
	for player in player_dict:
		dict_list[player] = []
		for team in player_dict[player]:
			pstats = {"Team": team}
			pstats['G'] = player_dict[player][team][0]
			pstats['PT'] = player_dict[player][team][1]
			pstats['AST'] = player_dict[player][team][2]
			pstats['RB'] = player_dict[player][team][3]
			pstats['BL'] = player_dict[player][team][4]
			pstats['ST'] = player_dict[player][team][5]
			dict_list[player].append(pstats)
	return dict_list

def teams_players(year1, year2, teams):
	global data
	team_dict = {}
	nodes_dict = {}
	team_ids = {}
	player_ids = {}
	i = 0
	# import pdb; pdb.set_trace()
	yearwise_data = {}
	for row in data.itertuples():
		team = row[5]
		player = row[2]
		year = int(row[1])
		if year < year1 or year > year2:
			continue
		if player[-1] == "*":
			player = player[:-1]
		if team not in teams:
			continue
		# print "contniued", player
		if row[5] not in team_ids:
			team_ids[row[5]] = i
			i+=1
		if "players" not in nodes_dict:
			nodes_dict["players"] = [player]
		else:
			if player not in nodes_dict["players"]:
				nodes_dict["players"].append(player)
		if "teams" not in nodes_dict:
			nodes_dict["teams"] = [team]
		else:
			if team not in nodes_dict["teams"]:
				nodes_dict["teams"].append(team)
		if player in team_dict:
			if team not in team_dict[player]:
				team_dict[player].append(team)
		else:
			team_dict[player] = [team]
	nodes = []
	node_ids = {}
	j = 0
	# print "here", nodes_dict['teams']
	for player_name in nodes_dict["players"]:
		temp_node = {}
		temp_node["name"] = player_name
		temp_node["group"] = team_ids[team_dict[player_name][0]]
		# temp_node["id"] = player_name
		node_ids[player_name] = j
		nodes.append(temp_node)
		j += 1
	# import pdb; pdb.set_trace()
	for team_name in nodes_dict["teams"]:
		temp_node = {}
		temp_node["name"] = team_name
		temp_node["group"] = team_ids[team_name]
		# temp_node["id"] = team_name
		node_ids[team_name] = j
		nodes.append(temp_node)
		j += 1
	links = []
	for each_player in team_dict:
		for each_team in team_dict[each_player]:
			temp_node = {}
			temp_node["source"] = node_ids[each_player]
			temp_node["target"] = node_ids[each_team]
			links.append(temp_node)
	# import pdb; pdb.set_trace()
	return [nodes, links]

@app.route('/teaminfo', methods=['POST'])
def teams_info():
	req_data = json.loads(request.data)
	# print(req_data)
	nl = teams_players(req_data['year1'], req_data['year2'], req_data['teams'])
	nodes_links = {}
	nodes_links["nodes"] = nl[0]
	nodes_links["links"] = nl[1]
	nodes_links["player_stats"] = player_team_stats(False, req_data['year1'], req_data['year2'], True, req_data['teams'])
	# print nodes_links["player_stats"]
	return pd.json.dumps(nodes_links)

def get_players_attribute(start, end, attribute, positions, display):
	global attrs
	players_detail_dict = {}
	players_detail = []
	attr_index = attrs[attribute]
	top = 10
	if display == 'Top25':
		top = 25
	elif display == 'Top50':
		top = 50
	else:
		top = 10
	# import pdb; pdb.set_trace()
	for row in data.itertuples():
		pos = row[3]
		player = row[2]
		year = int(row[1])
		attr_value = row[attr_index]
		if positions == 'G':
			positions.append('PG')
			positions.append('SG')
		if year < start or year > end or attr_value == 0 or pos not in positions:
			continue
		if player[-1] == '*':
			player = player[:-1]

		player = player + ":" + pos
		
		if player not in players_detail_dict:
			players_detail_dict[player] = int(attr_value)
		else:
			players_detail_dict[player] += int(attr_value)
		# if player == 'Stephen Curry':
		# 	print(year, ":", attr_value)
	players_sorted = [(k, players_detail_dict[k]) for k in sorted(players_detail_dict, key=players_detail_dict.get, reverse=True)]
	# import pdb; pdb.set_trace()
	i = 0
	for player_ in players_sorted:
		if i == top:
			break
		temp_dict = {}
		pl = player_[0].split(":")
		temp_dict["name"] = pl[0]
		temp_dict["value"] = player_[1]
		temp_dict["pos"] = pl[1]
		players_detail.append(temp_dict)
		i += 1
	# import pdb; pdb.set_trace()
	return players_detail

@app.route('/interstats', methods=['POST'])
def interesting_stats():
	# import pdb; pdb.set_trace()
	req_data = json.loads(request.data)
	players_detail = get_players_attribute(req_data['year1'], req_data['year2'], req_data['attribute'], req_data['positions'], req_data['display'])
	return pd.json.dumps(players_detail)

if __name__ == "__main__":
	app.run(debug = True)
	# spl_stats()
	# teams_players()
	# get_players_attribute(2010, 2012, '3 Pointers', 'PG')
