package ajweb.data;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;

import ajweb.model.AbstractModel;



public abstract class AbstractCondition implements AbstractModel{

	abstract public String toString();
	abstract protected String toPreparedSQL();
	abstract protected void setPreparedSQL(PreparedStatement st) throws SQLException;
	abstract protected int setPreparedSQLIndex(PreparedStatement st, int index) throws SQLException;
	abstract public boolean related(HashMap<String, String> item, HashMap<String, String> properties) throws Exception;
}
