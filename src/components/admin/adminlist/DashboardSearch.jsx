import React, { Component } from 'react';

class DashboardSearch extends Component {
	render() {
		return (
			<>
				<ul>
					<li>
						<div class="form-group  has-feedback">
							<label>Group</label>
							<select class="form-control ">
								<option key="-1" value="">
									Select
								</option>
								{this.props.groupList &&
									this.props.groupList.map((group, i) => (
										<option key={i} value={group.group_id}>
											{group.group_name}
										</option>
									))}
							</select>
							{/* <span class="help-block with-errors">Please correct the error</span> */}
						</div>
					</li>
					<li>
						<div class="form-group  has-feedback">
							<label>Customer</label>
							<select class="form-control">
								<option>None</option>
							</select>
							{/* <span class="help-block with-errors">Please correct the error</span> */}
						</div>
					</li>
					<li>
						<div class="form-group has-feedback">
							<label>Status</label>
							<div class="input-group">
								<input class="form-control" placeholder="Search "></input>
								<div class="input-group-btn">
									<button class="btn btn-default" type="submit">
										<i class="glyphicon glyphicon-search"></i>
									</button>
								</div>
							</div>
							{/* <span class="help-block with-errors">Please correct the error</span> */}
						</div>
					</li>
					<li>
						<div class="form-group has-feedback">
							<label>Priority</label>
							<select class="form-control">
								<option>None</option>
							</select>
							{/* <span class="help-block with-errors">Please correct the error</span> */}
						</div>
					</li>
					<li>
						<div class="form-group has-feedback">
							<label>Business Manager</label>
							<select class="form-control">
								<option>None</option>
							</select>
							{/* <span class="help-block with-errors">Please correct the error</span> */}
						</div>
					</li>
					<li>
						<div class="form-group has-feedback">
							<label>Overdue</label>
							<select class="form-control">
								<option>None</option>
							</select>
							{/* <span class="help-block with-errors">Please correct the error</span> */}
						</div>
					</li>
				</ul>
			</>
		);
	}
}

export default DashboardSearch;
